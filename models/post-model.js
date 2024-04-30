const {findIndex, findNextId, parseIntOrNull} = require("./utils");

module.exports = class {
    id = null;
    title = null;
    image = {
        name: "default.jpg",
        path: "http://localhost:8080/public/images/default.jpg"
    };
    content = null;

    author = {
        id: null,
        nickname: "DEFAULT",
        profile_image: "http://localhost:8080/public/images/default.jpg"
    };

    created_at = null;

    like_count = 0;
    comment_count = 0;
    view_count = 0;

    constructor(id,
                title, image, content,
                author, created_at,
                like_count = 0, comment_count = 0, view_count = 0) {
        this.id = parseIntOrNull(id);
        this.title = title;
        this.image = image;
        this.content = content;

        this.author.id = author ? parseInt(author.id) : null;
        this.author.nickname = author ? author.nickname : "ERROR";
        this.author.profile_image = author ? author.profile_image : "ERROR";

        this.created_at = created_at;

        this.like_count = like_count;
        this.comment_count = comment_count;
        this.view_count = view_count;

    }

    static _loadJSON() {
        return jsonParse("posts.json")
    }

    static create(title, content, file, author) {
        let filename = "default.jpg";
        let filePath = "http://localhost:8080/public/images/default.jpg";

        if (file != null) {
            filename = file.originalname;
            filePath = `http://localhost:8080/uploads/${file.filename}`;
        }

        return new this(
            null, title, {name: filename, path: filePath}, content,
            {id: author.id, nickname: author.nickname, profile_image: author.profile_image},
            new Date().toISOString(),
        )
    }

    static all() {
        return this._loadJSON().posts.sort((a, b) => b.id - a.id);
    }

    static find(id) {
        const _json_data = this._loadJSON()
        const idx = findIndex(_json_data.posts, id)
        const target = _json_data.posts[idx];

        return new this(
            id, target.title, target.image, target.content,
            target.author, target.created_at,
            target.like_count, target.comment_count, target.view_count
        );
    }

    save() {
        const _json_data = this.constructor._loadJSON()
        if (this.id == null) {
            const nextId = findNextId(_json_data.posts)

            _json_data.posts.push(
                {
                    id: nextId,
                    title: this.title,
                    image: this.image,
                    content: this.content,

                    author: this.author,

                    created_at: this.created_at,

                    like_count: this.like_count,
                    comment_count: this.comment_count,
                    view_count: this.view_count,
                }
            );
            this.id = nextId;
        } else {
            let idx = findIndex(_json_data.posts, this.id)

            _json_data.posts[idx].title = this.title;
            _json_data.posts[idx].image = this.image;
            _json_data.posts[idx].content = this.content;

            _json_data.posts[idx].author = this.author;

            _json_data.posts[idx].created_at = this.created_at;

            _json_data.posts[idx].like_count = this.like_count;
            _json_data.posts[idx].comment_count = this.comment_count;
            _json_data.posts[idx].view_count = this.view_count;

        }

        jsonWrite("posts.json", _json_data)
    }

    update(title, content, file, user) {
        let filename = this.image.name
        let filePath = this.image.path

        if (file != null) {
            filename = file.originalname;
            filePath = `http://localhost:8080/uploads/${file.filename}`;
        }

        this.title = title;
        this.content = content;
        this.image = {name: filename, path: filePath};
        this.author = {id: user.id, nickname: user.nickname, profile_image: user.profile_image}
    }

    can(user) {
        if (user.is_admin) {
            return true;
        }
        return parseInt(user.id) === this.author.id;
    }


    delete() {
        const _json_data = this.constructor._loadJSON()
        let idx = findIndex(_json_data.posts, this.id)
        _json_data.posts.splice(idx, 1)

        jsonWrite("posts.json", _json_data)
    }
}