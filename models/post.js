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

    static all() {
        return this._loadJSON().posts;
    }

    static find(id) {
        const _json_data = this._loadJSON()
        const idx = findIndex(_json_data.posts, id)
        const target = _json_data.posts[idx];

        return new this(id, target.title, target.content, target.image,
            target.like_count, target.comment_count, target.view_count);
    }

    save() {
        const _json_data = this.constructor._loadJSON()
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

            _json_data.posts[idx].title = this.title;
            _json_data.posts[idx].content = this.content;
            _json_data.posts[idx].image = this.image;
            _json_data.posts[idx].like_count = this.like_count;
            _json_data.posts[idx].comment_count = this.comment_count;
            _json_data.posts[idx].view_count = this.view_count;

        }

        jsonWrite("posts.json", _json_data)
    }

    update(title, content, image) {
        this.title = title;
        this.content = content;
        this.image = image;
    }
}