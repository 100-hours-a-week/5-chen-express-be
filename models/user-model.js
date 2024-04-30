const {findIndex, findNextId} = require("./utils");

module.exports = class {
    id = null;
    email = null;
    password = null;
    nickname = null;
    profile_image = null;
    is_admin = false;


    constructor(id, email, password, nickname, profile_image, is_admin) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.profile_image = profile_image;
        this.is_admin = is_admin;
    }

    static _loadJSON() {
        return jsonParse("users.json")
    }

    static create(email, password, nickname, profile_image) {

        return new this(null, email, password, nickname, profile_image, false)
    }

    static find(id) {
        const _json_data = this._loadJSON()

        const idx = findIndex(_json_data.users, id);

        const target = _json_data.users[idx];

        return new this(id, target.email, target.password, target.nickname, target.profile_image, target.is_admin);
    }

    static all() {
        return this._loadJSON().users;
    }

    save() {
        const _json_data = this.constructor._loadJSON()
        if (this.id == null) {
            const nextId = findNextId(_json_data.users)

            _json_data.users.push(
                {
                    id: nextId,
                    email: this.email,
                    password: this.password,
                    nickname: this.nickname,
                    profile_image: this.profile_image,
                    is_admin: this.is_admin,
                }
            );
        } else {
            let idx = findIndex(_json_data.users, this.id)

            _json_data.users[idx].email = this.email;
            _json_data.users[idx].password = this.password;
            _json_data.users[idx].nickname = this.nickname;
            _json_data.users[idx].profile_image = this.profile_image;
            _json_data.users[idx].is_admin = this.is_admin;

        }
        jsonWrite("users.json", _json_data)
    }

    update(email, password, nickname, filePath) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.profile_image = filePath
    }
}