import {Everything, Group, List, Post, User, Comment} from "./everything";

export enum UserDetail {
    Overview = 'overview',
    Submitted = 'submitted',
    Comments = 'comments',
    Upvoted = 'upvoted',
    Downvoted = 'downvoted',
    Hidden = 'hidden',
    Saved = 'saved',
    Gilded = 'gilded',
}

export class Unimplemented {
    readonly status: number = 400
    readonly message: string = 'Not Implemented'
}

export type Result<T> = T | Unimplemented;

export type GetGroupResult = Result<Everything<Group>>;

export type GetPostResult = Result<Everything<Post>>;

export type GetUserResult = Result<Everything<User>>;

export type GetPostsResult = Result<Everything<List<Post>>>;

export type GetUserDetailsResult = Result<Everything<List<Post | Comment>>>;

export type GetNestedCommentsResult = Result<Array<Everything<List>>>;

export type GetGroupsQueryResult = Result<Everything<List>>;

interface GroupOptions {
    subreddit: string
}

interface UserOptions {
    username: string
}

interface LimitableOptions {
    limit: number,
}

interface ListOptions extends LimitableOptions {
    sort?: string,
    secondarySort?: string,
}

interface CommentListOptions extends DepthListOptions, LimitableOptions {
    sort?: string
}

interface PageListOptions extends ListOptions {
    page?: string,
}

interface DepthListOptions {
    depth?: number
}

export interface GetGroupOptions extends GroupOptions {}

export interface GetPostOptions extends GroupOptions {
    id: string
}

export interface GetUserOptions extends UserOptions {}

export interface GetPostsOptions extends PageListOptions, GroupOptions {}

export interface GetUserDetailsOptions extends PageListOptions, UserOptions {
    userDetail?: UserDetail
}

export interface CommentIds {
    postId: string,
    commentId?: string
}

export interface GetNestedCommentsOptions extends CommentListOptions, GroupOptions {
    ids: CommentIds
}

export interface GetGroupsQuery extends LimitableOptions{
    query: string
}

export interface IService {
    getGroup(getGroupOptions: GetGroupOptions): Promise<GetGroupResult>
    getPost(getPostOptions: GetPostOptions): Promise<GetPostResult>
    getUser(getUserOptions: GetUserOptions): Promise<GetUserResult>
    getPosts(getPostsOptions: GetPostsOptions): Promise<GetPostsResult>
    getUserDetails(getUserDetailsOptions: GetUserDetailsOptions): Promise<GetUserDetailsResult>
    getNestedComments(getNestedCommentOptions: GetNestedCommentsOptions): Promise<GetNestedCommentsResult>
    getGroupsQuery(getGroupsQuery: GetGroupsQuery): Promise<GetGroupsQueryResult>
}
