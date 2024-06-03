const {query} = require("./mysql-model");

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

  static of(row) {
    return new this(row.id, row.email, row.password, row.nickname, row.profile_image, false);
  }

  static create(email, password, nickname, profile_image) {
    return new this(null, email, password, nickname, profile_image, false)
  }

  static async find(id) {
    return query("SELECT u.id, u.email, u.password, u.nickname, u.profile_image FROM `User` AS u WHERE u.id = ? AND u.deleted_at IS NULL;", id)
      .then(users => {
        const user = users[0];

        return this.of(user)
      })
  }

  static all() {
    return query("SELECT * FROM `User` WHERE deleted_at IS NULL").then(rows => rows.map(row => this.of(row)))
  }

  save() {
    if (this.id == null) {
      query("INSERT INTO `User` (profile_image, email, password, nickname, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, now(), NULL, NULL)", this.profile_image, this.email, this.password, this.nickname)
        .then(rows => {
          this.id = rows.insertId;
        });
    } else {
      query("UPDATE `User` SET profile_image = ?, nickname = ?, password = ? WHERE id = ?", this.profile_image, this.nickname, this.password, this.id);
    }
  }

  update(email, password, nickname, filePath) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.profile_image = filePath
  }
}