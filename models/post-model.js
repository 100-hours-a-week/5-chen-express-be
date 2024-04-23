const {findIndex, findNextId} = require("./utils");

module.exports = class {
    id = null;
    title = null;
    content = null;
    image = {
        "name": "default.jpg",
        "path": "http://localhost:8080/public/images/default.jpg"
    };
    like_count = 0;
    comment_count = 0;
    view_count = 0;
    created_at = null;
    author = {
        "nickname": "DEFAULT",
        "profile_image": "http://localhost:8080/public/images/default.jpg"
    };

    constructor(id, title, content, image, created_at, like_count = 0, comment_count = 0, view_count = 0) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.image = image;
        this.created_at = created_at;
        this.like_count = like_count;
        this.comment_count = comment_count;
        this.view_count = view_count;
    }

    static _loadJSON() {
        return jsonParse("posts.json")
    }

    static create(title, content, file) {
        let filename = "default.jpg";
        let filePath = "http://localhost:8080/public/images/default.jpg";

        if (file != null) {
            filename = file.originalname;
            filePath = `http://localhost:8080/uploads/${file.filename}`;
        }

        return new this(null, title, content, {name: filename, path: filePath}, new Date().toISOString())
    }

    static all() {
        return this._loadJSON().posts.sort((a, b) => b.id - a.id);
    }

    static find(id) {
        const _json_data = this._loadJSON()
        const idx = findIndex(_json_data.posts, id)
        const target = _json_data.posts[idx];

        return new this(id, target.title, target.content, target.image, target.created_at,
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
                    "author": this.author,
                }
            );
        } else {
            let idx = findIndex(_json_data.posts, this.id)

            _json_data.posts[idx].title = this.title;
            _json_data.posts[idx].content = this.content;
            _json_data.posts[idx].image = this.image;
            _json_data.posts[idx].created_at = this.created_at;
            _json_data.posts[idx].like_count = this.like_count;
            _json_data.posts[idx].comment_count = this.comment_count;
            _json_data.posts[idx].view_count = this.view_count;

        }

        jsonWrite("posts.json", _json_data)
    }

    update(title, content, file) {
        let filename = "default.jpg";
        let filePath = "http://localhost:8080/public/images/default.jpg";

        if (file != null) {
            filename = file.originalname;
            filePath = `http://localhost:8080/uploads/${file.filename}`;
        }

        this.title = title;
        this.content = content;
        this.image = {name: filename, path: filePath};
    }
}