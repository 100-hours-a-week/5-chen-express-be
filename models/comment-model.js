const {findIndex, findNextId} = require("./utils");

module.exports = class {
    id = null;
    content = null;
    created_at = null;
    author = {
        nickname: "ERROR",
        profile_image: "ERROR",
    }

    constructor(id, content, created_at, author) {
        this.id = id;
        this.content = content;
        this.created_at = created_at;
        this.author.nickname = author ? author.nickname : "ERROR";
        this.author.profile_image = author ? author.profile_image : "ERROR";
    }

    static _loadJSON() {
        return jsonParse("comments.json")
    }

    static create(content, author) {
        return new this(
            null, content,
            new Date().toISOString(),
            {nickname: author.nickname, profile_image: author.profile_image}
        )
    }

    static all() {
        return this._loadJSON().comments;
    }

    static find(id) {
        const _json_data = this._loadJSON()
        const idx = findIndex(_json_data.comments, id)
        const target = _json_data.comments[idx];

        return new this(id, target.content, target.created_at, target.author);
    }

    save() {
        const _json_data = this.constructor._loadJSON()
        if (this.id == null) {
            const nextId = findNextId(_json_data.comments)

            _json_data.comments.push(
                {
                    id: nextId,
                    author: this.author,
                    created_at: new Date().toISOString(),
                    content: this.content
                }
            );
        } else {
            let idx = findIndex(_json_data.comments, this.id)

            _json_data.comments[idx].content = this.content;
        }

        jsonWrite("comments.json", _json_data)
    }

    update(content) {
        this.content = content;
    }

    delete() {
        const _json_data = this.constructor._loadJSON()
        let idx = findIndex(_json_data.comments, this.id)
        _json_data.comments.splice(idx, 1)

        jsonWrite("comments.json", _json_data)
    }
}