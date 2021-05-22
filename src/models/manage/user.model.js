/* const query = require('../../db/db-connection');
const { multipleColumnSet } = require('../../utils/common.utils');
const Role = require('../../utils/userRoles.utils');
const TABLES = require('../../dbTableConstant'); */

const query = require('../../db/db-connection');
const { multipleColumnSet } = require('../../utils/common.utils');
const Role = require('../../utils/userRoles.utils');
const TABLES = require('../../dbTableConstant');

class UserModel {
    tableName = TABLES.ADMIN;
    tableMenus = TABLES.MENUS;
    tableUserPrevilegeMaster = TABLES.USER_PREVILEGE_MASTER;

    find = async (params = {}) => {
        
        let sql = `SELECT * FROM ${this.tableName}`;
        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
        
        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    }

    create = async ({ username, password, first_name, last_name, email, role = Role.SuperUser, age }) => {
        const sql = `INSERT INTO ${this.tableName}
        (username, password, first_name, last_name, email, role, age) VALUES (?,?,?,?,?,?,?)`;

        const result = await query(sql, [username, password, first_name, last_name, email, role, age]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    getUserPrevilege = async (roleId) => {
        let sql = `SELECT upm_range FROM ${this.tableUserPrevilegeMaster} where upm_id = ? AND isdelete = ? `;
        //const inserts = [ 'upm_range', this.tableUserPrevilegeMaster, 'upm_id', roleId,'isdelete',0 ];
        const result = await query(sql,[roleId,0]);
        const results = result ? result : [];
        return results[0]
    }

    getUserMenu = async (UserPrevilege) => {
        
        const UserPrevilegeValue = UserPrevilege.upm_range.toString();
        let sql = `SELECT * FROM ${this.tableMenus} where id IN (${UserPrevilegeValue})`;
        const result = await query(sql);
        const results = result ? result : [];
        return results;
    }

}

module.exports = new UserModel;