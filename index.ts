import ogs from "open-graph-scraper";

type Data = User | Group | Comment | Post

export class Everything<T extends Data> {
    public static user(user: User) : Everything<User> {
        return new Everything("t2", Object.assign(new User(), user)
        )
    }
    public static group(group: Group) : Everything<Group> {
        return new Everything("t5", Object.assign(new Group(), group))
    }
    public static comment(comment: Comment) : Everything<Comment> {
        return new Everything("t1", Object.assign(new Comment(), comment))
    }
    public static post(post: Post) : Everything<Post> {
        return new Everything("t3", Object.assign(new Post(), post))
    }
    private constructor(kind: string, data: T) {
        this.kind = kind
        this.data = data
    }

    readonly kind: string
    readonly data: T
}

export abstract class GroupBase {
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
    public_description?: string = '';
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
    description?: string = '';
    submit_link_label?: string = '';
    restrict_commenting?: boolean = false;
    url?: string = '';
    banner_size?: null = null;
    user_is_contributor?: null = null;
}
export class Group extends GroupBase {
    user_flair_background_color?: null = null;
    submit_text_html?: string = '';
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
    submit_text?: string = '';
    description_html?: string = '';
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
    public_description_html?: string = '';
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
export class Subreddit extends GroupBase {
    default_set?: boolean = false;
    icon_color?: string = '';
    previous_names?: (null)[] | null = null;
    over_18?: boolean = false;
    is_default_icon?: boolean = false;
    is_default_banner?: boolean = false;
}
export abstract class PostBase {
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

export class Post extends PostBase {
    selftext?: string = '';
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
    selftext_html?: string | null = null;
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

    async buildMetadata(): Promise<Post> {
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

        return this
    }
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
export class Comment extends PostBase {
    comment_type?: null = null;
    replies?: string = '';
    collapsed_reason_code?: null = null;
    parent_id?: string = '';
    collapsed?: boolean = false;
    body?: string = '';
    is_submitter?: boolean = false;
    body_html?: string = '';
    collapsed_reason?: null = null;
    associated_award?: null = null;
    unrepliable_reason?: null = null;
    score_hidden?: boolean = false;
    link_id?: string = '';
    controversiality?: number = 0;
    depth?: number = 0;
    collapsed_because_crowd_control?: null = null;
}
