import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SlPaperPlane, SlActionUndo, SlTrash, SlLike, SlDislike, SlArrowDown, SlClose } from "react-icons/sl";
import { useQueryClient } from 'react-query';
import Navbar from '../../../../components/organisms/Navbar';
import Input from '../../../../components/atoms/Input';
import Button from '../../../../components/atoms/Button';
import { useGetCommentListQuery, useGetCommentListQueryKey, useGetRepliesQuery, useGetRepliesQueryKey } from '../../queries';
import { CommentType } from '../../Types.Comment';
import { AuthContext } from '../../../auth/Auth.context';
import usePostComment from '../../mutations/PostComment.mutation';
import useDeleteComment from '../../mutations/DeleteComment.mutation';
import socket from '../../../../configs/socket.config';
import { BasicSocketType } from '../../../../configs/Types.Socket';
import { format, parseISO } from 'date-fns';
import LoadingScreen from '../../../../components/organisms/LoadingScreen/LoadingScreen.organism';
import usePostReview from '../../mutations/PostReview.mutation';

const Home: React.FC = (() => {
  const queryClient = useQueryClient();
  const { currentUserData } = useContext(AuthContext);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const repliesEndRef = useRef<null | HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [postIsLoading, setPostIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showRepliesScrollButton, setShowRepliesScrollButton] = useState(false);
  const [showRepliesId, setShowRepliesId] = useState('');
  const [socketActiveId, setSocketActiveId] = useState<BasicSocketType | null>(null);
  const limit = 10;

  const {data, isLoading, isFetchedAfterMount} = useGetCommentListQuery({page, limit});
  const commentsData = useMemo(() => data?.comments, [data?.comments]);
  const commentMetaData = useMemo(() => data?.metadata, [data?.metadata]);

  const repliesQuery = useGetRepliesQuery({parentId: showRepliesId});
  const replies = useMemo(() => repliesQuery.data?.replies, [repliesQuery.data?.replies]);
  const activeComment = useMemo(() => repliesQuery.data?.comment, [repliesQuery.data?.comment]);
  const isRepliesLoading = repliesQuery.isLoading;
  const isRepliesFetchedAfterMount = repliesQuery.isFetchedAfterMount;
  const scrollToBottom = useCallback(() => 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  , []);

  const scrollToBottomReplies = useCallback(() =>
    repliesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  , []);

  const postCommentMutation = usePostComment({
    onSuccess: () => {
      setPostIsLoading(false);
      setCommentText('');
      setReplyText('');
      if (showRepliesId !== '') {
        queryClient.refetchQueries([useGetRepliesQueryKey, showRepliesId]);
        scrollToBottomReplies();
      }
      if (page !== 1) {
        setPage(1);
      } else {
        queryClient.invalidateQueries([useGetCommentListQueryKey, 1, limit]);
        scrollToBottom();
      }
    },
    onError: (err: any) => {
      setPostIsLoading(false);
      setErrMessage(`Something went wrong. ${err.message}`);
    },
  });

  const deleteCommentMutation = useDeleteComment({
    onSuccess: () => {
      setPostIsLoading(false);
      queryClient.invalidateQueries([useGetCommentListQueryKey, page, limit]);
      if (showRepliesId) {
        queryClient.refetchQueries([useGetRepliesQueryKey, showRepliesId]);
      }
    },
    onError: (err: any) => {
      setPostIsLoading(false);
      setErrMessage(`Something went wrong. ${err.message}`);
    },
  });

  const postReviewMutation = usePostReview({
    onSuccess: () => {
      queryClient.invalidateQueries([useGetCommentListQueryKey, page, limit]);
      if (showRepliesId) {
        queryClient.refetchQueries([useGetRepliesQueryKey, showRepliesId]);
      }
    },
    onError: (err: any) => {
      setPostIsLoading(false);
      setErrMessage(`Something went wrong. ${err.message}`);
    },
  })

  useEffect(() => {
    if (isFetchedAfterMount) {
      scrollToBottom();
    }
  },[isFetchedAfterMount, scrollToBottom]);

  useEffect(() => {
    if (isRepliesFetchedAfterMount) {
      scrollToBottomReplies();
    }
  },[isRepliesFetchedAfterMount, scrollToBottomReplies]);

  useEffect(() => {
    if ((socketActiveId?.replyTo !== '' && socketActiveId?.replyTo === showRepliesId) || socketActiveId?.type === 'delete') {
      queryClient.invalidateQueries([useGetRepliesQueryKey, showRepliesId]);
      if (socketActiveId.type === 'insert') {
        setShowRepliesScrollButton(true)
      }
      setSocketActiveId(null);
    }
  }, [queryClient, showRepliesId, socketActiveId])

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      console.log('Connected');
    }

    const onDisconnect = () => {
      console.log('Disconnected');
    }

    const onComments = (socketData: BasicSocketType) => {
      if (!socketData.replyTo) {
        if (socketData.type === 'insert') {
          setShowScrollButton(true);
        }
      } else {
        setSocketActiveId(socketData);
      }
      if (socketData && socketData.id && socketData.userId !== currentUserData?._id) {
        queryClient.invalidateQueries([useGetCommentListQueryKey, page, limit]);
      }
      if (socketData.type === 'delete') {
        setSocketActiveId(socketData);
        queryClient.refetchQueries([useGetCommentListQueryKey, page, limit]);
      }
    }

    socket.on('connect', onConnect);
    socket.on('comments', onComments);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('comments', onComments);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postComment = useCallback((parentId?: string) => {
    setPostIsLoading(true);
    setErrMessage('');
    postCommentMutation.mutate({ comment: parentId ? replyText : commentText, parentId });
  },[commentText, postCommentMutation, replyText]);

  const deleteComment = useCallback((id: string) => {
    setPostIsLoading(true);
    setErrMessage('');
    deleteCommentMutation.mutate({ id });
  },[deleteCommentMutation]);

  const postReview = useCallback((commentId: string, like: number) => {
    postReviewMutation.mutate({commentId, like})
  }, [postReviewMutation])

  const renderCard = useCallback((comment: CommentType, isReply?: boolean, isRepliesModalOpened?:boolean) => {
    const isSelf = currentUserData?._id === comment.author._id;
    const currentLikeBySelf = comment?.userLikes?.[0]?.like || 0;
    return (
      <div className={`w-full flex flex-col rounded-md px-3 py-2 gap-2 ${isSelf ? 'bg-teal-700' : 'bg-neutral-700'}`} key={comment._id}>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row gap-2 items-center'>
            <div className='w-4 h-4 flex justify-center items-center rounded-full bg-orange-500 text-white uppercase p-3'>{comment.author.username.charAt(0)}</div>
            <div className='flex flex-col'>
              <span className='font-bold'>{comment.author.username}</span>
              <span className='font-light text-xs'>{format(parseISO(comment.updatedAt.toString()), "MMMM dd, hh:mm aa")}</span>
            </div>
          </div>
          <div className='flex flex-row gap-5'>
            {
              isSelf && !isRepliesModalOpened && <SlTrash className='cursor-pointer' onClick={() => deleteComment(comment._id)}/>
            }
          </div>
        </div>
        <p>
          {comment.comment}
        </p>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-row justify-start items-center gap-2 cursor-pointer'>
          {
            !isReply && !isRepliesModalOpened && 
              <div  
                className='flex flex-row justify-start items-center gap-2 cursor-pointer'
                role='button'
                onClick={() => setShowRepliesId(comment._id)}
              >
                <SlActionUndo className='cursor-pointer'/>
                <span>Replies</span>
              </div>
          }
          </div>
          {
            !isRepliesModalOpened &&
              <div className='flex flex-row justify-end items-center basis-1/2 gap-10'>
                <span className='flex flex-row justify-center items-center gap-2 cursor-pointer' role='button' onClick={() => postReview(comment._id, currentLikeBySelf === -1 ? 0 : -1)}>
                  <SlDislike className='cursor-pointer' color={currentLikeBySelf === -1 ? 'grey' : 'white'}/>
                  <span>{comment?.dislikeCount?.toString()}</span>
                </span>
                <span className='flex flex-row justify-center items-center gap-2 cursor-pointer' role='button' onClick={() => postReview(comment._id, currentLikeBySelf === 1 ? 0 : 1)}>
                  <SlLike className='cursor-pointer' color={currentLikeBySelf === 1 ? 'skyblue' : 'white'}/>
                  <span>{comment?.likeCount?.toString()}</span>
                </span>
              </div>
          }
        </div>
      </div>
    )
  }
  ,[currentUserData?._id, deleteComment, postReview])

  const renderComments = useMemo(() =>
    commentsData?.map((comment) => {
      return (
        <Fragment key={comment._id}>
          { renderCard(comment) }
          { comment.replies.length > 0 && 
            <div className='flex flex-row gap-2'>
              <div className='h-full border-r border-orange-500 border-solid px-2' />
              <div className='flex flex-col flex-1 gap-2'>
                {
                  comment.replies?.map((reply) => renderCard(reply, !!reply.parentId)).reverse()
                }
              </div>
            </div>
          }
        </Fragment>
      )
    }).reverse()
  ,[commentsData, renderCard])

  const renderReplies = useMemo(() => isRepliesLoading ? <LoadingScreen /> :
    <div className='w-screen h-screen fixed bg-neutral-900 bg-opacity-90 z-50 top-0 left-0 right-0 bottom-0 flex flex-col items-center'>
      <div className='w-full lg:w-1/3 lg:max-h-[90vh] flex flex-col items-center gap-3 justify-between overflow-scroll'>
        <h1 className='pt-20'>Replies</h1>
        { activeComment && renderCard(activeComment, false, true) }
        <div className='w-full flex flex-col bg-neutral-800 lg:rounded-md overflow-scroll grow p-2 gap-3'>
          <div className='flex flex-row gap-2'>
            <div className='h-full border-r border-orange-500 border-solid px-2' />
            <div className='flex flex-col flex-1 gap-2'>
              { replies && replies.map((reply) => renderCard(reply, !!reply.parentId)).reverse()}
            </div>
          </div>
          <div
            className={`self-center absolute text-sm rounded bg-sky-600 border border-neutral-200 shadow-lg flex flex-row items-center px-3 py-2 gap-2 ${!showRepliesScrollButton ? 'hidden' : ''}`}
            role='button'
            onClick={() => [scrollToBottomReplies(), setShowRepliesScrollButton(false)]}>
            <span>New Replies!</span>
            <SlArrowDown />
          </div>
          <div ref={repliesEndRef} />
        </div>
        <div className='flex flex-row w-full gap-2 px-1'>
          <div className='flex-1'>
            <Input
              placeholder='Type your message here...'
              className='min-w-full'
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && postComment(activeComment?._id)}
              value={replyText}
            />
          </div>
          <Button onClick={() => postComment(activeComment?._id)} disabled={isRepliesLoading || postIsLoading}><SlPaperPlane color='white' /></Button>
          </div>
      </div>
      <SlClose className='absolute top-5 right-5 text-3xl cursor-pointer' role='button' onClick={() => [setShowRepliesId(''), setReplyText('')]} />
    </div>
  ,[isRepliesLoading, activeComment, renderCard, replies, showRepliesScrollButton, replyText, postIsLoading, scrollToBottomReplies, postComment])

  return (
    <div className='w-screen'>
      <Navbar />
      <div className='w-full flex flex-col items-center'>
        <div className='w-full lg:w-1/3 h-screen lg:max-h-[90vh] flex flex-col items-center gap-3 justify-between'>
          <h1 className='pt-20'>Comment System</h1>
          <div className='flex flex-row justify-end gap-2 items-center'>
            <Button buttonType='outlined' disabled={page === 1} onClick={() =>setPage(1)}>&#60;&#60;</Button>
            <Button buttonType='outlined' disabled={page === 1} onClick={() =>setPage(page - 1)}>&#60;</Button>
            <span>{page}</span>
            <Button
              buttonType='outlined'
              disabled={!!(commentMetaData?.count && commentMetaData?.count <= page * limit)}
              onClick={() => setPage(page + 1)}
            >&#62;</Button>
            <Button
              buttonType='outlined'
              disabled={!!(commentMetaData?.count && commentMetaData?.count <= page * limit)}
              onClick={() => setPage(commentMetaData?.count ? Math.round(commentMetaData?.count / limit) : page + 1)}
            >&#62;&#62;</Button>
          </div>
          <div className='w-full flex flex-col bg-neutral-800 lg:rounded-md overflow-scroll grow p-2 gap-3'>
            { renderComments }
            <div
              className={`self-center absolute text-sm rounded bg-sky-600 border border-neutral-200 shadow-lg flex flex-row items-center px-3 py-2 gap-2 ${!showScrollButton ? 'hidden' : ''}`}
              role='button'
              onClick={() => [setPage(1), scrollToBottom(), setShowScrollButton(false)]}>
              <span>New Message!</span>
              <SlArrowDown />
            </div>
            <div ref={messagesEndRef} />
          </div>
          <div className='flex flex-row w-full gap-2'>
            <div className='flex-1'>
              <Input
                placeholder='Type your message here...'
                className='min-w-full'
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && postComment()}
                value={commentText}
              />
            </div>
            <Button onClick={() => postComment()} disabled={isLoading || postIsLoading}><SlPaperPlane color='white' /></Button>
          </div>
        </div>
        {
          errMessage && <span className='text-red-400 w-full text-center'>{errMessage}</span>
        }
      </div>
      {showRepliesId && renderReplies}
    </div>
  )
});

export default Home;