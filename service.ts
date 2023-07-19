import {EverythingData, Group, List, Post, User, Comment} from "./everything";

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

export enum SearchType {
    Group = 'sr',
    Post = 'link',
    User = 'user'
}

export class Unimplemented {
    readonly status: number = 400
    readonly message: string = 'Not Implemented'
}

export type Result<T> = T | Unimplemented;

export type GetGroupResult = Result<EverythingData<Group>>;

export type GetPostResult = Result<EverythingData<Post>>;

export type GetUserResult = Result<EverythingData<User>>;

export type GetPostsResult = Result<EverythingData<List<Post>>>;

export type GetUserDetailsResult = Result<EverythingData<List<Post | Comment>>>;

export type GetNestedCommentsResult = Result<Array<EverythingData<List>>>;

export type AutocompleteResult = Result<EverythingData<List>>;

export type SearchResult = Result<EverythingData<List>>

export type Id = string;
export type Name = string;
export type Limit = number;
export type Page = string;
export type Sort = string;
export type Depth = number;
export type Query = string;

export interface GetGroupOptions {
    group: Name
}

export interface GetPostOptions {
    group: Name
    id: Id
}

export interface GetUserOptions {
    username: Name
}

export interface GetPostsOptions {
    group: Name
    limit: Limit,
    page?: Page,
    sort?: Sort,
    secondarySort?: Sort,
}

export interface GetUserDetailsOptions {
    username: Name,
    limit: Limit,
    page?: Page,
    userDetail: UserDetail
    sort?: Sort,
    secondarySort?: Sort,
}

export interface CommentIds {
    postId: Id,
    commentId?: Id
}

export interface GetNestedCommentsOptions {
    group: Name
    ids: CommentIds
    limit: Limit,
    sort?: Sort,
    secondarySort?: Sort,
    depth?: Depth
}

export interface AutocompleteOptions {
    query: Query,
    limit: Limit,
    includeOver18?: boolean,
    searchType: SearchType.Group | [SearchType.Group, SearchType.User]
}

export interface SearchOptions {
    group?: Name,
    query: Query,
    exact?: boolean
    limit: Limit,
    page?: Page,
    sort?: Sort,
    secondarySort?: Sort,
    searchType: SearchType | Array<SearchType>
    searchInGroup: boolean
}

export interface IService {
    getGroup(getGroupOptions: GetGroupOptions): Promise<GetGroupResult>
    getPost(getPostOptions: GetPostOptions): Promise<GetPostResult>
    getUser(getUserOptions: GetUserOptions): Promise<GetUserResult>
    getPosts(getPostsOptions: GetPostsOptions): Promise<GetPostsResult>
    getUserDetails(getUserDetailsOptions: GetUserDetailsOptions): Promise<GetUserDetailsResult>
    getNestedComments(getNestedCommentOptions: GetNestedCommentsOptions): Promise<GetNestedCommentsResult>
    autocomplete(autocompleteOptions: AutocompleteOptions): Promise<AutocompleteResult>
    search(searchOptions: SearchOptions): Promise<SearchResult>
}
