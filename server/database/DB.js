const sqlite = require('sqlite3').verbose();
const path   = require('path');
const ROOT   = path.resolve(__dirname);

module.exports = class DB {
    static db = new sqlite.Database(ROOT + '/matcha.db',
        err => console.log(err ? err : 'Connected to db'));

    /* used to create or alter tables and to insert or update table data, or delete data */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            DB.db.prepare(sql, params).run(function (err) {
                if (err) {
                    console.log('Error running your sql\n', err);
                    reject(err);
                } else {
                    console.log('result from DB == ' + this.lastID);
                    resolve(this.lastID);
                }
            })
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            DB.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql, err);
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            DB.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error getting data from db\n', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
    }

    create(table, columns, values) {
        return this.run(`INSERT INTO ${table} (${columns}) VALUES (${'?, '.repeat(values.length - 1) + '?'})`, values);
    }

    createMultiple(table, columns, values) {
        return this.run(`INSERT INTO ${table} (${columns}) VALUES ${'(?), '.repeat(values.length - 1) + '(?)'}`, values);
    }

    getByUnique(table, column, value) {
        return this.get(`SELECT * FROM ${table} WHERE ${column} = ?`, [value]);
    }

    getAllByUnique(table, column, value) {
        return this.all(`SELECT * FROM ${table} WHERE ${column} = ?`, [value]);
    }

    getAllByFilter(columns, filters, values, having, order) {
        return this.all(`SELECT ${columns.map(value => `users.${value}`).join(', ')} FROM users
            LEFT JOIN  users_tags ON users.id = users_tags.user_id
            LEFT JOIN  tags ON users_tags.tag_id = tags.id
         WHERE users.activation = 1 ${filters}
         GROUP BY users.id ${having} ${order}`, values);
    }

    getAll(table) {
        return this.all(`SELECT * FROM ${table}`);
    }

    getAllTagsForUser(id) {
        return this.all(`SELECT tags.id, tags.tag FROM tags
            JOIN users_tags ON tags.id = users_tags.tag_id
            WHERE users_tags.user_id = ?`, [id]);
    }

    getUser(id) {
        return this.all(`SELECT
  users.id          as users_id,      
  users.username    as users_username,
  users.firstname   as users_firstname,
  users.lastname    as users_lastname,
  users.gender      as users_gender,
  users.bday        as users_bday,
  users.added       as users_added,
  users.location    as users_location,
  users.avatar      as users_avatar,
  users.personality as users_personality,
  users.preference  as users_preference,
  users.occupancy   as users_occupancy,
  users.rating      as users_rating,
  users.bio         as users_bio,
  photos.filename   as photos_filename,
  posts.id          as posts_id,
  posts.title       as posts_title,
  posts.post        as posts_post,
  posts.added       as posts_added,
  tags.id           as tags_id,
  tags.tag          as tags_tag
FROM users
  LEFT JOIN photos ON users.id = photos.user_id
  LEFT JOIN posts ON users.id = posts.user_id
  LEFT JOIN users_tags ON users.id = users_tags.user_id
  LEFT JOIN tags ON users_tags.tag_id = tags.id
WHERE users.id = ?`, [id]);
    }

    update(table, column, value, key, data) {
        return this.run(`UPDATE ${table} SET ${column} = ? WHERE ${key} = ?`, [value, data]);
    }

    updateMultiple(table, data, key, value) {
        let columns = Object.keys(data).join(' = ?, ') + ' = ?',
            values  = Object.values(data);
        return this.run(`UPDATE ${table} SET ${columns} WHERE ${key} = ?`, values.concat(value));
    }

    delete(table, columns, values) {
        return this.run(`DELETE FROM ${table} WHERE ${columns.map(column => `${column} = ?`).join(' and ')}`, values);
    }
};
