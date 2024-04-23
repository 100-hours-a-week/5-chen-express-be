const {findIndex, findNextId} = require("./utils");

module.exports = class {
    id = null;
    title = null;
    content = null;
    image = null;
    like_count = 0;
    comment_count = 0;
    view_count = 0;

    constructor(id, title, content, image, like_count = 0, comment_count = 0, view_count = 0) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.image = image;
        this.like_count = like_count;
        this.comment_count = comment_count;
        this.view_count = view_count;
    }

    static _loadJSON() {
        return jsonParse("posts.json")
    }

    static create(title, content, image) {
        return new this(null, title, content, image)
    }

    static find(id) {
        const _json_data = this._loadJSON()

        let targetPost;

        for (const post of _json_data.posts) {
            if (post.id === id) {
                targetPost = post
                break;
            }
        }

        return new this(id, targetPost.title, targetPost.content, targetPost.image,
            targetPost.like_count, targetPost.comment_count, targetPost.view_count);
    }

    save() {
        const _json_data = jsonParse("posts.json")
        if (this.id == null) {
            const nextId = findNextId(_json_data.posts)

            _json_data.posts.push(
                {
                    "id": nextId,
                    "title": this.title,
                    "content": this.content,
                    "like_count": this.like_count,
                    "comment_count": this.comment_count,
                    "view_count": this.view_count,
                    "created_at": new Date().toISOString(),
                    "image": this.image,
                    "author": {
                        "nickname": "JohnDoe1985",
                        "profile_image": "/images/snake.jpg"
                    }
                }
            );
        } else {
            let idx = findIndex(_json_data.posts, this.id)

            _json_data.posts[idx].title = title;
            _json_data.posts[idx].content = content;
            _json_data.posts[idx].image = image;
            _json_data.posts[idx].like_count = like_count;
            _json_data.posts[idx].comment_count = comment_count;
            _json_data.posts[idx].view_count = view_count;

        }
        jsonWrite("posts.json", _json_data)
    }

    update(title, content, image) {
        this.title = title;
        this.content = content;
        this.image = image;
    }
}