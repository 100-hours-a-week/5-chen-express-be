const {findIndex, findNextId, parseIntOrNull} = require("./utils");

module.exports = class {
    id = null;
    content = null;

    post = {
        id: null,
    }
    author = {
        id: null,
        nickname: "ERROR",
        profile_image: "ERROR",
    }
    created_at = null;

    constructor(id, content, post, author, created_at) {
        this.id = parseIntOrNull(id);
        this.content = content;

        this.post.id = parseIntOrNull(post.id);

        this.author.id = author ? parseIntOrNull(author.id) : null;
        this.author.nickname = author ? author.nickname : "ERROR";
        this.author.profile_image = author ? author.profile_image : "ERROR";

        this.created_at = created_at;
    }

    static _loadJSON() {
        return jsonParse("comments.json")
    }

    static create(content, post_id, author) {
        return new this(
            null, content,
            {id: post_id},
            {id: author.id, nickname: author.nickname, profile_image: author.profile_image},
            new Date().toISOString()
        )
    }

    static all() {
        return this._loadJSON().comments.sort((a, b) => b.id - a.id);
    }

    static find(id) {
        const _json_data = this._loadJSON()
        const idx = findIndex(_json_data.comments, id)
        const target = _json_data.comments[idx];

        return new this(
            id, target.content,
            target.post,
            target.author,
            target.created_at
        );
    }

    static findAllByPostId(post_id) {
        return this._loadJSON().comments
            .filter(comment => {
                return parseInt(comment.post.id) === parseInt(post_id);
            })
            .sort((a, b) => b.id - a.id);
    }

    save() {
        const _json_data = this.constructor._loadJSON()
        if (this.id == null) {
            const nextId = findNextId(_json_data.comments)

            _json_data.comments.push(
                {
                    id: nextId,
                    content: this.content,

                    post: this.post,
                    author: this.author,
                    created_at: this.created_at,
                }
            );
        } else {
            let idx = findIndex(_json_data.comments, this.id)

            _json_data.comments[idx].content = this.content;
            _json_data.comments[idx].post = this.post;
            _json_data.comments[idx].author = this.author;
        }

        jsonWrite("comments.json", _json_data)
    }

    update(content, user) {
        this.content = content;
        this.author = {id: user.id, nickname: user.nickname, profile_image: user.profile_image}
    }

    delete() {
        const _json_data = this.constructor._loadJSON()
        let idx = findIndex(_json_data.comments, this.id)
        _json_data.comments.splice(idx, 1)

        jsonWrite("comments.json", _json_data)
    }

    can(user) {
        if (user.is_admin) {
            return true;
        }
        return parseInt(user.id) === this.author.id;
    }
}