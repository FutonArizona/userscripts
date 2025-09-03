/*
{
  "post": {
    "id": "134952439",
    "user": "16382653",
    "service": "patreon",
    "title": "Title",
    "content": "Description",
    "embed": {},
    "shared_file": false,
    "added": "2025-08-07T13:38:41.872980",
    "published": "2025-07-25T19:29:58",
    "edited": "2025-07-25T19:46:48",
    "file": {
      "name": "001.gif",
      "path": "/64/16/641615f84033bb494a760f6ac80c681aa8fdc8b1449f20bc483ccf24d71e0a19.gif"
    },
    "attachments": [
      {
        "name": "File.zip",
        "path": "/01/31/0131d2f98a04a95bcc36e1ab3b2f9d36a688ff071fa88f0db49dfacf26d925a8.zip"
      },
      {
        "name": "001.gif",
        "path": "/64/16/641615f84033bb494a760f6ac80c681aa8fdc8b1449f20bc483ccf24d71e0a19.gif"
      }
    ],
    "poll": null,
    "captions": null,
    "tags": [
      "Animation",
      "tag1",
      "tag2",
      "tag3"
    ],
    "next": "134953812",
    "prev": "135352206"
  },
  "attachments": [
    {
      "server": "https://n2.kemono.cr",
      "name": File.zip",
      "extension": ".zip",
      "name_extension": ".zip",
      "stem": "0131d2f98a04a95bcc36e1ab3b2f9d36a688ff071fa88f0db49dfacf26d925a8",
      "path": "/01/31/0131d2f98a04a95bcc36e1ab3b2f9d36a688ff071fa88f0db49dfacf26d925a8.zip"
    }
  ],
  "previews": [
    {
      "type": "thumbnail",
      "server": "https://n4.kemono.cr",
      "name": "001.gif",
      "path": "/64/16/641615f84033bb494a760f6ac80c681aa8fdc8b1449f20bc483ccf24d71e0a19.gif"
    },
    {
      "type": "thumbnail",
      "server": "https://n4.kemono.cr",
      "name": "001.gif",
      "path": "/64/16/641615f84033bb494a760f6ac80c681aa8fdc8b1449f20bc483ccf24d71e0a19.gif"
    }
  ],
  "videos": [],
  "props": {
    "flagged": null,
    "revisions": [
      [
        0,
        {
          "id": "134952439",
          "user": "16382653",
          "service": "patreon",
          "title": "Title",
          "content": "Description",
          "embed": {},
          "shared_file": false,
          "added": "2025-08-07T13:38:41.872980",
          "published": "2025-07-25T19:29:58",
          "edited": "2025-07-25T19:46:48",
          "file": {
            "name": "001.gif",
            "path": "/64/16/641615f84033bb494a760f6ac80c681aa8fdc8b1449f20bc483ccf24d71e0a19.gif"
          },
          "attachments": [
            {
              "name": "File.zip",
              "path": "/01/31/0131d2f98a04a95bcc36e1ab3b2f9d36a688ff071fa88f0db49dfacf26d925a8.zip"
            },
            {
              "name": "001.gif",
              "path": "/64/16/641615f84033bb494a760f6ac80c681aa8fdc8b1449f20bc483ccf24d71e0a19.gif"
            }
          ],
          "poll": null,
          "captions": null,
          "tags": [
            "Animation",
            "tag2",
            "tag3",
            "tag4"
          ],
          "next": "134953812",
          "prev": "135352206"
        }
      ]
    ]
  }
}
*/

declare namespace Kemono {
    type PostService = "patreon" | "pixiv" | "fanbox";

    /**
     * Post information
     */
    interface Post {
        /**
         * Post ID
         *
         * ex: `"134952439"`
         */
        id: string;

        /**
         * Post author ID
         *
         * ex: `"16382653"`
         */
        user: string;

        /**
         * Post service
         *
         * ex: `"patreon"`
         */
        service: PostService;

        /**
         * Post title
         *
         * ex: `"title"`
         */
        title: string;

        /**
         * Post text content (description)
         *
         * ex: `"hello, this is a post"`
         */
        content: string;

        /**
         * Post embed
         *
         * ex: `unknown`
         */
        embed: Embed; // TODO: get example embed object

        /**
         * If there is a shared file(?)
         *
         * ex: `false`
         */
        shared_file: boolean;

        /**
         * Time the post was added to Kemono (local tz)
         *
         * ex: `"2025-08-07T13:38:41.872980"`
         */
        added: Date;

        /**
         * Time the post was originally created on the service platform (local tz)
         *
         * ex: `"2025-07-25T19:29:58"`
         */
        published: Date;

        /**
         * Time the post was last edited (local tz)
         *
         * ex: `"2025-07-25T19:46:48"`
         */
        edited: Date;

        /**
         * Preview file information
         */
        file: Pick<Attachment, "name" | "path">;

        /**
         * File attachments
         */
        attachments: Array<Pick<Attachment, "name" | "path">>;

        /**
         * Poll object
         *
         * ex: `unknown | null`
         */
        poll: null; // TODO: get example poll object

        /**
         * Captions object
         *
         * ex: `unknown: null`
         */
        captions: null; // TODO: get example captions object

        /**
         * List of post tags
         *
         * ex: `["tag1", "tag2", "tag3"]`
         */
        tags: Array<string>;

        /**
         * Next post ID
         *
         * ex: `"134953812"`
         */
        next: string;

        /**
         * Previous post ID
         *
         * ex: `"135352206"`
         */
        previous: string;
    }

    /**
     * File attachment
     */
    interface Attachment {
        /**
         * Host name
         *
         * ex: `"https://n2.kemono.cr/"`
         */
        server: string;

        /**
         * File name
         *
         * ex: `"test_file.zip"`
         */
        name: string;

        /**
         * File extension
         *
         * ex: `".zip"`
         */
        extension: string;

        /**
         * File extension
         *
         * ex: `".zip"`
         */
        name_extension: string;

        /**
         * (Seemingly) File hash
         *
         * ex: `"0131d2f98a04a95bcc36e1ab3b2f9d36a688ff071fa88f0db49dfacf26d925a8"`
         */
        stem: string;

        /**
         * File path
         *
         * ex: `"/01/31/0131d2f98a04a95bcc36e1ab3b2f9d36a688ff071fa88f0db49dfacf26d925a8.zip"`
         */
        path: string;
    }

    interface Embed {
        /**
         * Embed description
         *
         * ex: `"description"`
         */
        description: string | null;

        /**
         * Embed subject
         *
         * ex: `"171.63 MB file on MEGA"`
         */
        subject: string;

        /**
         * Embed URL
         *
         * ex: `"https://file.com/file_url"`
         */
        url: string;
    }

    /**
     * Object representing a choice in a poll
     */
    interface PollChoice {
        /**
         * The choice name
         *
         * ex: `"apples"`
         */
        text: string;

        /**
         * The number of votes a choice has
         *
         * ex: `15`
         */
        votes: number;
    }

    interface Poll {
        /**
         * If the poll allows users to vote for multiple options
         *
         * ex: `true`
         */
        allows_multiple: boolean;

        /**
         * Array of choice objects
         */
        choices: Array<PollChoice>;

        /**
         * The date of poll close
         *
         * ex: `"2025-05-29T08:44:00+00:00"`
         */
        closes_at: Date;

        /**
         * The date of poll creation
         *
         * ex: `"2025-05-24T06:09:32+00:00"`
         */
        created_at: Date;

        /**
         * The poll description
         *
         * ex: `"description"
         */
        description: string | null;

        /**
         * The poll title
         *
         * ex: `"test poll"`
         */
        title: string;
    }

    /**
     * Preview type
     */
    type PreviewType = "thumbnail" | "embed";

    /**
     * Preview images
     */
    interface Preview {
        /**
         * Preview type
         *
         * ex: `"thumbnail"`
         */
        type: PreviewType;

        /**
         * Server host origin
         *
         * ex: `"https://n4.kemono.cr"`
         */
        server: string;

        /**
         * File name
         *
         * ex: `"001.gif"`
         */
        name: string;

        /**
         * File URL path
         *
         * ex: `"/64/16/641615f84033bb494a760f6ac80c681aa8fdc8b1449f20bc483ccf24d71e0a19.gif"`
         */
        path: string;
    }

    /**
     * Post properties
     */
    interface Properties {
        /**
         * If the post has been flagged(?)
         *
         * ex: `null`
         */
        flagged: boolean | null;

        /**
         * List of post revisions
         *
         * ex: `[[0, <post info>], [1, <post info>]]`
         */
        revisions: Array<[number, Post]>;
    }

    /**
     * Video information
     */
    interface Video {
        /**
         * Host name
         *
         * ex: `"https://n2.kemono.cr/"`
         */
        server: string;

        /**
         * Video index in the post
         *
         * ex: `0`
         */
        index: number;

        /**
         * File name
         *
         * ex: `"test_file.zip"`
         */
        name: string;

        /**
         * File extension
         *
         * ex: `".zip"`
         */
        extension: string;

        /**
         * File extension
         *
         * ex: `".zip"`
         */
        name_extension: string;

        /**
         * File path
         *
         * ex: `"/01/31/0131d2f98a04a95bcc36e1ab3b2f9d36a688ff071fa88f0db49dfacf26d925a8.zip"`
         */
        path: string;
    }

    /**
     * Response body of the GET post endpoint
     */
    interface GetPostResponse {
        post: Post;
        attachments: Array<Attachment>;
        previews: Array<Preview>;
        videos: Array<Video>;
        props: Properties;
    }
}
