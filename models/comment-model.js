const {findIndex, findNextId} = require("./utils");

module.exports = class {
    id = null;
    content = null;

    author = {
        id: null,
        nickname: "ERROR",
        profile_image: "ERROR",
    }
    created_at = null;

    constructor(id, content, author, created_at) {
        this.id = id;
        this.content = content;

        this.author.id = author ? author.id : null;
        this.author.nickname = author ? author.nickname : "ERROR";
        this.author.profile_image = author ? author.profile_image : "ERROR";

        this.created_at = created_at;
    }

    static _loadJSON() {
        return jsonParse("comments.json")
    }

    static create(content, author) {
        return new this(
            null, content,
            {id: author.id, nickname: author.nickname, profile_image: author.profile_image},
            new Date().toISOString()
        )
    }

    static all() {
        return this._loadJSON().comments;
    }

    static find(id) {
        const _json_data = this._loadJSON()
        const idx = findIndex(_json_data.comments, id)
        const target = _json_data.comments[idx];

        return new this(
            id, target.content,
            target.author,
            target.created_at
        );
    }

    save() {
        const _json_data = this.constructor._loadJSON()
        if (this.id == null) {
            const nextId = findNextId(_json_data.comments)

            _json_data.comments.push(
                {
                    id: nextId,
                    content: this.content,

                    author: this.author,
                    created_at: this.created_at,
                }
            );
        } else {
            let idx = findIndex(_json_data.comments, this.id)

            _json_data.comments[idx].content = this.content;
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
}