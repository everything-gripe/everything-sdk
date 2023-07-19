import ogs from "open-graph-scraper";
import {Converter} from "showdown";
import {TypedProxy} from "./util"

export type Data = User | Group | Comment | Post | List | MoreComments
export type ListData<T extends Data> = List<T> & Data
export type EverythingData<T extends Data = Data> = Everything<Required<T>> & Required<T>

export enum Kind {
    List = "Listing",
    MoreComments = "more",
    User = "t2",
    Group = "t5",
    Comment = "t1",
    Post = "t3"
}

type Required<T> = {
    [P in keyof T]-?: T[P];
};

type MarkdownText = string
type MarkdownHtml = string
type MarkdownFieldTypes = string;
type Markdown<T extends MarkdownFieldTypes, TData extends Data> = MarkdownBase<T, TData> & {
    [K in T]?: MarkdownText
} & {
    [K in `${T}_html`]?: MarkdownHtml | null;
}

abstract class MarkdownBase<T extends MarkdownFieldTypes, TData extends Data> {
    abstract readonly markdownFields?: ReadonlyArray<T>

    isKey?(key: keyof this | any): key is keyof this {
        return key in this
    }

    isMarkdown?(value: any): value is MarkdownText | MarkdownHtml {
        return typeof value === 'string'
    }

    buildMarkdown?(buildMarkdown: (markdownField: keyof this, markdownFieldHtml: keyof this) => void) {
        return () => {
            for (const markdownField of this.markdownFields!) {
                const markdownFieldHtml = `${markdownField}_html`
                if (!this.isKey!(markdownFieldHtml) || !this.isKey!(markdownField)) continue;

                buildMarkdown(markdownField, markdownFieldHtml)
            }

            return new Return.Parent<TData>()
        }
    }

    buildHtmlFromMarkdown? =
        this.buildMarkdown!((markdownField, markdownFieldHtml) => {
            const markdownText = this[markdownField]
            if (!this.isMarkdown!(markdownText)) return;

            this[markdownFieldHtml] = new Converter().makeHtml(markdownText) as any
        })

    buildMarkdownFromHtml? =
        this.buildMarkdown!((markdownField, markdownFieldHtml)=> {
            const markdownHtml = this[markdownFieldHtml]
            if (!this.isMarkdown!(markdownHtml)) return;

            this[markdownField] = new Converter().makeMarkdown(markdownHtml) as any
        })
}

//Hack for elevated return of `this`
class Return {
    static Parent: {
        new<T extends Data> (): EverythingData<T>
    } = Return as any
}

export class Everything<T extends Data = Data> {
    public static list<T extends Data = Data>(list: List<T>) {
        return new Everything.Constructor(Kind.List, assign<ListData<T>>(new List<T>(), list))
    }
    public static moreComments(moreComments: MoreComments) {
        return new Everything.Constructor(Kind.MoreComments, assign(new MoreComments(), moreComments))
    }
    public static user(user: User) {
        if (user.subreddit) {
            user.subreddit = assign(new Subreddit(), user.subreddit)
        }
        return new Everything.Constructor(Kind.User, assign(new User(), user))
    }
    public static group(group: Group) {
        return new Everything.Constructor(Kind.Group, assign(new Group(), group))
    }
    public static comment(comment: Comment) {
        return new Everything.Constructor(Kind.Comment, assign(new Comment(), comment))
    }
    public static post(post: Post) {
        return new Everything.Constructor(Kind.Post, assign(new Post(), post))
    }

    // public isKey(key: keyof (typeof this & T)): key is keyof typeof this {
    //     return key in this
    // }
    //
    // public isDataKey(key: keyof (typeof this & T)): key is keyof T {
    //     return key in this.data
    // }

    private static Constructor: {
        new<T extends Data = Data>(kind: Kind, data: Required<T>): EverythingData<T>
    } = Everything as any

    constructor(kind: Kind, data: Required<T>) {
        this.kind = kind
        this.data = data

        const proxy = new TypedProxy<typeof this, typeof this & T>(this, {
            get: (target, prop) => {
                //TODO: Preferred method if we can get it to work.
                // if (target.isKey(prop)) {
                //     return target[prop];
                // }
                // if (target.isDataKey(prop)) {
                //     return target.data[prop]
                // }

                const value = {...target.data, ...target}[prop]
                type valueType = typeof value
                if (typeof value === 'function') {
                    return ((...args: any) => {
                        const resultReturn = (result: any) => result instanceof Return ? proxy : result

                        const result = value(...args)
                        return result instanceof Promise
                            ? result.then(resultReturn)
                            : resultReturn(result)
                    }) as valueType
                }
                return value;
            }
        })
        return proxy
    }

    readonly kind: Kind
    readonly data: Required<T>
}

export class List<T extends Data = Data> {
    after?: string | null = null;
    dist?: number | null = null;
    modhash?: string = '';
    geo_filter?: null = null;
    children?: (EverythingData<T>)[] = [];
    before?: string | null = null;

    static isGroup(everything: EverythingData): everything is EverythingData<Group> {
        //TODO: Ensure this works AND is the best way to go about it.
        return everything.data as any instanceof Group
    }

    toAutocompleteV1?(): AutocompleteV1 {
        return {
            //TODO: Figure out a better way to go about this.
            subreddits: (this.children! as unknown as Array<EverythingData>).filter(List.isGroup).map((group: EverythingData<Group>) => ({
                numSubscribers: group.data.subscribers ?? 0,
                name: group.data.display_name ?? '',
                id: group.data.name ?? '',
                primaryColor: group.data.primary_color ?? '',
                communityIcon: group.data.community_icon ?? '',
                icon: group.data.icon_img ?? '',
                allowedPostTypes: {
                    images: group.data.allow_images ?? false,
                    //TODO: Figure out where this is set
                    text: true,
                    videos: group.data.allow_videos ?? false,
                    //TODO: Figure out where this is set
                    links: true,
                    //TODO: Is this correct?
                    spoilers: group.data.spoilers_enabled ?? false
                }
            }))
        }
    }
}

export class MoreComments {
    count: number = 0;
    name: string = '';
    id: string = '';
    parent_id: string = '';
    depth: number = 0
    children: Array<string> = []
}

export abstract class GroupBase<T extends MarkdownFieldTypes, TData extends Data> extends MarkdownBase<T, TData>{
    restrict_posting?: boolean = false;
    user_is_banned?: null = null;
    free_form_reports?: boolean = false;
    user_is_muted?: null = null;
    display_name?: string = '';
    header_img?: string = '';
    title?: string = '';
    icon_size?: (number)[] | null = null;
    primary_color?: string = '';
    icon_img?: string = '';
    display_name_prefixed?: string = '';
    subscribers?: number = 0;
    name?: string = '';
    quarantine?: boolean = false;
    public_description?: MarkdownText = '';
    community_icon?: string = '';
    header_size?: (number)[] | null = null;
    key_color?: string = '';
    user_is_subscriber?: null = null;
    allowed_media_in_comments?: (string)[] | null = null;
    submit_text_label?: string = '';
    link_flair_position?: string = '';
    accept_followers?: boolean = false;
    link_flair_enabled?: boolean = false;
    disable_contributor_requests?: boolean = false;
    subreddit_type?: string = '';
    banner_img?: string = '';
    show_media?: boolean = false;
    user_is_moderator?: null = null;
    description?: MarkdownText = '';
    submit_link_label?: string = '';
    restrict_commenting?: boolean = false;
    url?: string = '';
    banner_size?: null = null;
    user_is_contributor?: null = null;
}

const GroupMarkdownFields = ['submit_text', 'description', 'public_description'] as const
type GroupMarkdownFieldTypes = typeof GroupMarkdownFields[number]

export class Group extends GroupBase<GroupMarkdownFieldTypes, Group> implements Markdown<GroupMarkdownFieldTypes, Group> {
    readonly markdownFields? = GroupMarkdownFields

    user_flair_background_color?: null = null;
    submit_text_html?: MarkdownHtml = '';
    wiki_enabled?: boolean = false;
    user_can_flair_in_sr?: null = null;
    allow_galleries?: boolean = false;
    active_user_count?: number = 0;
    accounts_active?: number = 0;
    public_traffic?: boolean = false;
    user_flair_richtext?: (null)[];
    videostream_links_count?: number = 0;
    hide_ads?: boolean = false;
    prediction_leaderboard_entry_type?: string = '';
    emojis_enabled?: boolean = false;
    advertiser_category?: string = '';
    comment_score_hide_mins?: number = 0;
    allow_predictions?: boolean = false;
    user_has_favorited?: null = null;
    user_flair_template_id?: null = null;
    banner_background_image?: string = '';
    original_content_tag_enabled?: boolean = false;
    community_reviewed?: boolean = false;
    submit_text?: MarkdownText = '';
    description_html?: MarkdownHtml = '';
    spoilers_enabled?: boolean = false;
    comment_contribution_settings?: CommentContributionSettings = new CommentContributionSettings();
    allow_talks?: boolean = false;
    user_flair_position?: string = '';
    all_original_content?: boolean = false;
    has_menu_widget?: boolean = false;
    is_enrolled_in_new_modmail?: null = null;
    can_assign_user_flair?: boolean = false;
    created?: number = 0;
    wls?: number = 6;
    show_media_preview?: boolean = false;
    submission_type?: string = '';
    allow_videogifs?: boolean = false;
    should_archive_posts?: boolean = false;
    user_flair_type?: string = '';
    allow_polls?: boolean = false;
    collapse_deleted_comments?: boolean = false;
    emojis_custom_size?: null = null;
    public_description_html?: MarkdownHtml = '';
    allow_videos?: boolean = false;
    is_crosspostable_subreddit?: boolean = false;
    notification_level?: null = null;
    should_show_media_in_comments_setting?: boolean = false;
    can_assign_link_flair?: boolean = false;
    accounts_active_is_fuzzed?: boolean = false;
    allow_prediction_contributors?: boolean = false;
    user_sr_flair_enabled?: null = null;
    user_flair_enabled_in_sr?: boolean = false;
    allow_chat_post_creation?: boolean = false;
    allow_discovery?: boolean = false;
    user_sr_theme_enabled?: boolean = false;
    suggested_comment_sort?: null = null;
    user_flair_text?: null = null;
    banner_background_color?: string = '';
    id?: string = '';
    over18?: boolean = false;
    header_title?: string = '';
    is_chat_post_feature_enabled?: boolean = false;
    user_flair_text_color?: null = null;
    user_flair_css_class?: null = null;
    allow_images?: boolean = false;
    lang?: string = '';
    whitelist_status?: string = 'all_ads';
    created_utc?: number = 0;
    mobile_banner_image?: string = '';
    allow_predictions_tournament?: boolean = false;
}
export class CommentContributionSettings {
    allowed_media_types?: (string)[] | null;
}
export class User {
    is_employee?: boolean = false;
    is_friend?: boolean = false;
    subreddit?: Subreddit = new Subreddit();
    snoovatar_size?: null = null;
    awardee_karma?: number = 0;
    id?: string = '';
    verified?: boolean = false;
    is_gold?: boolean = false;
    is_mod?: boolean = false;
    awarder_karma?: number = 0;
    has_verified_email?: boolean = false;
    icon_img?: string = '';
    hide_from_robots?: boolean = false;
    link_karma?: number = 0;
    is_blocked?: boolean = false;
    total_karma?: number = 0;
    pref_show_snoovatar?: boolean = false;
    name?: string = '';
    created?: number = 0;
    created_utc?: number = 0;
    snoovatar_img?: string = '';
    comment_karma?: number = 0;
    accept_followers?: boolean = false;
    has_subscribed?: boolean = false;
}


export class Subreddit extends GroupBase<MarkdownFieldTypes, Subreddit> {
    readonly markdownFields? = [] as const

    default_set?: boolean = false;
    icon_color?: string = '';
    previous_names?: (null)[] | null = null;
    over_18?: boolean = false;
    is_default_icon?: boolean = false;
    is_default_banner?: boolean = false;
}

export abstract class PostBase<T extends MarkdownFieldTypes, TData extends Data> extends MarkdownBase<T, TData> {
    approved_at_utc?: null = null;
    subreddit?: string = '';
    user_reports?: (null)[] = [];
    saved?: boolean = false;
    mod_reason_title?: null = null;
    gilded?: number = 0;
    subreddit_name_prefixed?: string = '';
    downs?: number = 0;
    top_awarded_type?: null = null;
    name?: string = '';
    author_flair_background_color?: string = '';
    subreddit_type?: string = 'public';
    ups?: number = 0;
    total_awards_received?: number = 0;
    author_flair_template_id?: null = null;
    author_fullname?: string = '';
    can_mod_post?: boolean = false;
    score?: number = 0;
    approved_by?: null = null;
    author_premium?: boolean = false;
    edited?: boolean = false;
    author_flair_css_class?: string = '';
    author_flair_richtext?: (null)[] = [];
    gildings?: {} = {}
    mod_note?: null = null;
    created?: number = 0;
    banned_by?: null = null;
    author_flair_type?: string = 'text';
    likes?: null = null;
    banned_at_utc?: null = null;
    archived?: boolean = false;
    no_follow?: boolean = false;
    all_awardings?: (null)[] = [];
    awarders?: (null)[] = [];
    can_gild?: boolean = false;
    locked?: boolean = false;
    author_flair_text?: string = '';
    treatment_tags?: (null)[] = [];
    num_reports?: null = null;
    distinguished?: string | null = null;
    subreddit_id?: string = '';
    author_is_blocked?: boolean = false;
    mod_reason_by?: null = null;
    removal_reason?: null = null;
    id?: string = '';
    report_reasons?: null = null;
    author?: string = '';
    send_replies?: boolean = true;
    author_patreon_flair?: boolean = false;
    author_flair_text_color?: string = '';
    permalink?: string = '';
    stickied?: boolean = false;
    created_utc?: number = 0;
    mod_reports?: (null)[] = [];
    media_metadata?: (null)[];
}

const PostMarkdownFields = ['selftext'] as const
type PostMarkdownFieldTypes = typeof PostMarkdownFields[number]

export class Post extends PostBase<PostMarkdownFieldTypes, Post> implements Markdown<PostMarkdownFieldTypes, Post> {
    readonly markdownFields? = PostMarkdownFields

    selftext?: MarkdownText = '';
    clicked?: boolean = false;
    title?: string = '';
    link_flair_richtext?: (LinkFlairRichtextEntity)[] = [];
    hidden?: boolean = false;
    pwls?: number = 6;
    link_flair_css_class?: string = '';
    thumbnail_height?: null = null;
    parent_whitelist_status?: string = 'all_ads';
    hide_score?: boolean = false;
    quarantine?: boolean = false;
    link_flair_text_color?: string = 'dark';
    upvote_ratio?: number = 0;
    media_embed?: {} = {}
    thumbnail_width?: null = null;
    is_original_content?: boolean = false;
    secure_media?: null = null;
    is_reddit_media_domain?: boolean = false;
    is_meta?: boolean = false;
    category?: null = null;
    secure_media_embed?: {} = {};
    link_flair_text?: string | null = null;
    is_created_from_ads_ui?: boolean = false;
    thumbnail?: string = '';
    post_hint?: string = '';
    content_categories?: null = null;
    is_self?: boolean = false;
    link_flair_type?: string = 'text';
    wls?: number = 6;
    removed_by_category?: null = null;
    domain?: string = '';
    allow_live_comments?: boolean = false;
    selftext_html?: MarkdownHtml | null = null;
    suggested_sort?: string | null = null;
    view_count?: null = null;
    is_crosspostable?: boolean = false;
    pinned?: boolean = false;
    over_18?: boolean = false;
    preview?: Preview = undefined;
    media_only?: boolean = false;
    link_flair_template_id?: string;
    spoiler?: boolean = false;
    visited?: boolean = false;
    removed_by?: null = null;
    link_flair_background_color?: string = '';
    is_robot_indexable?: boolean = false;
    num_duplicates?: number = 0;
    discussion_type?: null = null;
    num_comments?: number = 0;
    media?: null = null;
    contest_mode?: boolean = false;
    whitelist_status?: string = 'all_ads';
    url: string = '';
    subreddit_subscribers?: number = 0;
    num_crossposts?: number = 0;
    is_video?: boolean = false;

    buildMetadata = async () => {
        if (!this.is_self) {
            try {
                const {result: metadata} = await ogs({url: this.url})
                this.title ||= metadata.ogTitle || ''

                if (metadata.ogImage?.length) {
                    const preview: Preview = {
                        images: metadata.ogImage.map(image =>
                            ({
                                source: {
                                    url: image.url,
                                    width: image.width || 1200,
                                    height: image.height || 630
                                },
                                resolutions: [
                                    {
                                        url: image.url,
                                        width: image.width || 1200,
                                        height: image.height || 630
                                    }
                                ],
                                variants: {},
                                id: image.url
                            })
                        ),
                        enabled: true
                    }

                    this.thumbnail = metadata.ogImage[0].url
                    this.preview = preview
                }
            } catch (e) {}
        }

        return new Return.Parent<Post>()
    };
}



export class LinkFlairRichtextEntity {
    e?: string = '';
    t?: string = '';
}
export class Preview {
    images: (ImagesEntity)[] = [];
    enabled: boolean = false;
}
export class ImagesEntity {
    source: ImageSource = new ImageSource();
    resolutions: (ImageSource)[] = [];
    variants: {} = {}
    id: string = '';
}
export class ImageSource {
    url?: string = '';
    width?: number = 0;
    height?: number = 0;
}

const CommentMarkdownFields = ['body'] as const
type CommentMarkdownFieldTypes = typeof CommentMarkdownFields[number]

export class Comment extends PostBase<CommentMarkdownFieldTypes, Comment> implements Markdown<CommentMarkdownFieldTypes, Comment>{
    readonly markdownFields? = CommentMarkdownFields

    comment_type?: null = null;
    replies?: EverythingData<List<Comment>> | string = '';
    collapsed_reason_code?: null = null;
    parent_id?: string = '';
    collapsed?: boolean = false;
    body?: MarkdownText = '';
    is_submitter?: boolean = false;
    body_html?: MarkdownHtml = '';
    collapsed_reason?: null = null;
    associated_award?: null = null;
    unrepliable_reason?: null = null;
    score_hidden?: boolean = false;
    link_id?: string = '';
    controversiality?: number = 0;
    depth?: number = 0;
    collapsed_because_crowd_control?: null = null;
}

export class AutocompleteV1 {
    subreddits: (AutocompleteV1Subreddit)[] = [];
}
export class AutocompleteV1Subreddit {
    numSubscribers: number = 0;
    name: string = '';
    allowedPostTypes: AllowedPostTypes = new AllowedPostTypes();
    id: string = '';
    primaryColor: string = '';
    communityIcon: string = '';
    icon: string = '';
}
export class AllowedPostTypes {
    images: boolean = false;
    text: boolean = false;
    videos: boolean = false;
    links: boolean = false;
    spoilers: boolean = false;
}

function assign<T extends Data>(target: T, ...sources: T[]) {
    for (const source of sources) {
        for (const key of Object.keys(source)) {
            const val = source[key as keyof T];
            if (val !== undefined) {
                target[key as keyof T] = val;
            }
        }
    }
    return target as Required<T>;
}
