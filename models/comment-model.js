const {findIndex, parseIntOrNull} = require("./utils");
const {query} = require("./mysql-model");

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

  static async all() {
    return query(`SELECT c.id,
                         c.post_id,
                         c.content,
                         u.id       as author_id,
                         u.nickname as nickname,
                         u.profile_image,
                         c.created_at
                  FROM Comment as c
                           LEFT JOIN User as u ON u.id = c.user_id
                  ORDER BY c.created_at DESC `)
      .then(rows => {
        return rows.map(row => this.of(row.id, row.post_id, row.content, row.author_id, row.nickname, row.profile_image, row.created_at))
      })
  }

  static async find(id) {
    return query(`SELECT c.id,
                         c.post_id,
                         c.content,
                         u.id       as author_id,
                         u.nickname as nickname,
                         u.profile_image,
                         c.created_at
                  FROM Comment as c
                           LEFT JOIN User as u ON u.id = c.user_id
                  WHERE c.id = ?`, id)
      .then(rows => {
        const row = rows[0];
        return this.of(row.id, row.post_id, row.content, row.author_id, row.nickname, row.profile_image, row.created_at)
      })
  }

  static findAllByPostId(post_id, user) {
    return query(`SELECT c.id,
                         c.post_id,
                         c.content,
                         u.id       as author_id,
                         u.nickname as nickname,
                         u.profile_image,
                         c.created_at
                  FROM Comment as c
                           LEFT JOIN User as u ON u.id = c.user_id
                  WHERE c.post_id = ?
                  ORDER BY c.created_at DESC `, post_id)
      .then(rows => {
        return rows.map(row => this.of(row.id, row.post_id, row.content, row.author_id, row.nickname, row.profile_image, row.created_at))
      }).then(comments => comments.map(comment => {
        comment.can = comment.can(user);
        return comment
      }))
  }

  save() {
    if (this.id == null) {
      query(
        `INSERT INTO Comment (post_id, user_id, content, created_at)
         VALUES (?, ?, ?, NOW())`,
        this.post.id, this.author.id, this.content)
        .then(rows => {
          this.id = rows.insertId;
        });
    } else {
      query(
        `UPDATE Comment
         SET content    = ?,
             updated_at = now()
         WHERE id = ?;`, this.content, this.id)
    }
  }

  update(content, user) {
    this.content = content;
    this.author = {id: user.id, nickname: user.nickname, profile_image: user.profile_image}
  }

  delete() {
    query(`DELETE
           FROM Comment
           WHERE id = ?`, this.id);
  }

  can(user) {
    if (user.is_admin) {
      return true;
    }
    return parseInt(user.id) === this.author.id;
  }

  static of(id, post_id, content, author_id, nickname, profile_image, created_at) {
    return new this(id, content, {id: post_id}, {
      id: author_id,
      nickname: nickname,
      profile_image: profile_image
    }, created_at);
  }
}