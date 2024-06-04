const {findIndex, parseIntOrNull} = require("./utils");
const {query} = require("./mysql-model");

module.exports = class {
  id = null;
  title = null;
  image = {
    name: "default.jpg", path: "http://localhost:8080/public/images/default.jpg"
  };
  content = null;

  author = {
    id: null, nickname: "DEFAULT", profile_image: "http://localhost:8080/public/images/default.jpg"
  };

  created_at = null;

  like_count = 0;
  comment_count = 0;
  view_count = 0;

  constructor(id, title, image, content, author, created_at, like_count = 0, comment_count = 0, view_count = 0) {
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

  static of(row) {
    return new this(
      row.id,
      row.title,
      {name: "default.jpg", path: row.image,},
      row.content,
      {id: row.user_id, nickname: row.nickname, profile_image: row.profile_image},
      row.created_at,
      12_345,
      row.comment_count,
      row.view_count
    );
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

    return new this(null, title, {name: filename, path: filePath}, content, {
      id: author.id,
      nickname: author.nickname,
      profile_image: author.profile_image
    }, new Date().toISOString(),)
  }

  static async all() {
    return query(`
        SELECT p.id,
               p.title,
               p.image,
               p.content,
               p.created_at,
               p.view_count,
               p.user_id,
               u.nickname,
               u.profile_image,
               IFNULL(ccnt.cnt, 0) as comment_count
        FROM Post as p
                 JOIN User u on u.id = p.user_id
                 LEFT JOIN (SELECT count(c.id) as cnt, c.post_id
                            FROM Comment c
                            GROUP BY c.post_id) as ccnt on ccnt.post_id = p.id
        WHERE u.deleted_at IS NULL
        ORDER BY p.created_at DESC
    `,).then(rows => {
      return rows.map(row => this.of(row))
    })
  }

  static async find(id) {
    return query(`
        SELECT p.id,
               p.title,
               p.image,
               p.content,
               p.created_at,
               p.view_count,
               p.user_id,
               u.nickname,
               u.profile_image,
               IFNULL(ccnt.cnt, 0) as comment_count
        FROM Post as p
                 JOIN User u on u.id = p.user_id
                 LEFT JOIN (SELECT count(c.id) as cnt, c.post_id
                            FROM Comment c
                            GROUP BY c.post_id) as ccnt on ccnt.post_id = p.id
        WHERE u.deleted_at IS NULL
          AND p.id = ?
        ORDER BY p.created_at DESC
    `, id)
      .then(rows => {
        const row = rows[0]
        return this.of(row);
      });
  }

  save() {
    if (this.id == null) {
      query(
        `INSERT INTO Post (title, image, user_id, content, created_at, view_count)
         VALUES (?, ?, ?, ?, NOW(), ?)`,
        this.title, this.image, this.author.id, this.content, this.view_count)
        .then(rows => {
          this.id = rows.insertId;
        });
    } else {
      query(
        `UPDATE Post
         SET title      = ?,
             image      = ?,
             content    = ?,
             view_count = ?,
             updated_at = NOW()
         WHERE id = ?;`, this.title, this.image.path, this.content, this.view_count, this.id)
    }
  }

  update(title, content, file) {
    let filename = this.image.name
    let filePath = this.image.path

    console.log(file);
    if (file != null) {
      filename = file.originalname;
      filePath = `http://localhost:8080/uploads/${file.filename}`;
    }

    this.title = title;
    this.content = content;
    this.image = {name: filename, path: filePath};
  }

  addViewCount() {
    this.view_count = this.view_count + 1
  }

  can(user) {
    return parseInt(user.id) === this.author.id;
  }


  delete() {
    const _json_data = this.constructor._loadJSON()
    let idx = findIndex(_json_data.posts, this.id)
    _json_data.posts.splice(idx, 1)

    jsonWrite("posts.json", _json_data)
  }
}