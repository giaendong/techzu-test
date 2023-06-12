import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SlPaperPlane, SlActionUndo, SlTrash, SlLike, SlDislike, SlArrowDown } from "react-icons/sl";
import { useQueryClient } from 'react-query';
import Navbar from '../../../../components/organisms/Navbar';
import Input from '../../../../components/atoms/Input';
import Button from '../../../../components/atoms/Button';
import { useGetCommentListQuery, useGetCommentListQueryKey } from '../../queries';
import { CommentType } from '../../Types.Comment';
import { AuthContext } from '../../../auth/Auth.context';
import usePostComment from '../../mutations/PostComment.mutation';
import useDeleteComment from '../../mutations/DeleteComment.mutation';
import socket from '../../../../configs/socket.config';
import { BasicSocketType } from '../../../../configs/Types.Socket';
import { format, parseISO } from 'date-fns';

const Home: React.FC = (() => {
  const queryClient = useQueryClient();
  const { currentUserData } = useContext(AuthContext);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [postIsLoading, setPostIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const limit = 10;

  const {data, isLoading, isFetchedAfterMount} = useGetCommentListQuery({page, limit});
  const commentsData = useMemo(() => data?.comments, [data?.comments]);
  const commentMetaData = useMemo(() => data?.metadata, [data?.metadata]);
  
  const scrollToBottom = useCallback(() => 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  , []);

  const postCommentMutation = usePostComment({
    onSuccess: () => {
      setPostIsLoading(false);
      setCommentText('');
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
    },
    onError: (err: any) => {
      setPostIsLoading(false);
      setErrMessage(`Something went wrong. ${err.message}`);
    },
  });

  useEffect(() => {
    if (isFetchedAfterMount) {
      scrollToBottom();
    }
  },[isFetchedAfterMount, scrollToBottom]);

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      console.log('Connected');
    }

    const onDisconnect = () => {
      console.log('Disconnected');
    }

    const onComments = (socketData: BasicSocketType) => {
      console.log(socketData);
      if (socketData?.isNotReply === true) {
        console.log('ok');
        setShowScrollButton(true);
      }
      if (socketData && socketData.id && socketData.userId !== currentUserData?.id) {
        console.log('oks');
        queryClient.invalidateQueries([useGetCommentListQueryKey, page, limit]);
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

  const postComment = useCallback(() => {
    setPostIsLoading(true);
    setErrMessage('');
    postCommentMutation.mutate({ comment: commentText });
  },[commentText, postCommentMutation]);

  const deleteComment = useCallback((id: string) => {
    setPostIsLoading(true);
    setErrMessage('');
    deleteCommentMutation.mutate({ id });
  },[deleteCommentMutation]);

  const renderCard = useCallback((comment: CommentType, isReply?: boolean) => {
    const isSelf = currentUserData?.id === comment.author.id;
    return (
      <div className={`w-full flex flex-col rounded-md px-3 py-2 gap-2 ${isSelf ? 'bg-teal-700' : 'bg-neutral-700'}`} key={comment.id}>
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
              isSelf && <SlTrash className='cursor-pointer' onClick={() => deleteComment(comment.id)}/>
            }
          </div>
        </div>
        <p>
          {comment.comment}
        </p>
        <div className='flex flex-row justify-between'>
          <span className='flex flex-row justify-start items-center gap-2 cursor-pointer'>
          {
            !isReply && 
              <>
                <SlActionUndo className='cursor-pointer'/>
                <span>Replies</span>
              </>
          }
          </span>
          <div className='flex flex-row justify-end items-center basis-1/2 gap-10'>
            <span className='flex flex-row justify-center items-center gap-2 cursor-pointer'>
              <SlDislike className='cursor-pointer'/>
              <span>1</span>
            </span>
            <span className='flex flex-row justify-center items-center gap-2 cursor-pointer'>
              <SlLike className='cursor-pointer'/>
              <span>205</span>
            </span>
          </div>
        </div>
      </div>
    )
  }
  ,[currentUserData?.id, deleteComment])

  const renderComments = useMemo(() =>
    commentsData?.map((comment) => {
      return (
        <Fragment key={comment.id}>
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
            <Button onClick={postComment} disabled={isLoading || postIsLoading}><SlPaperPlane color='white' /></Button>
          </div>
        </div>
        {
          errMessage && <span className='text-red-400 w-full text-center'>{errMessage}</span>
        }
      </div>
    </div>
  )
});

export default Home;