import ADBProvider from './ADBProvider';

import AxonConfig from '../Structures/DataStructure/AxonConfig';
import GuildConfig from '../Structures/DataStructure/GuildConfig';

import JsonManager from './JSON/JsonManager';

/**
 * @typedef {import('../AxonOptions').default} AxonOptions
 * @typedef {import('../AxonClient').default} AxonClient
 * @typedef {String|Boolean|Object.<string, any>|Array<any>|Number|Date} updateDBVal
 * @typedef {{
 * id: String, prefix: String, createdAt: Date, updatedAt: Date, bannedUsers: Array<String>, bannedGuilds: Array<String>
 * }} AxonConfigRaw
 * @typedef {{
 * guildID: string, prefixes: Array<String>, createdAt: Date, updatedAt: Date, modules: Array<String>, commands: Array<String>, listeners: Array<String>,
 * ignoredUsers: Array<String>, ignoredRoles: Array<String>, ignoredChannels: Array<String>, modOnly: Boolean, modRoles: Array<String>, modUsers: Array<String>
 * }} GuildConfigRaw
 */

/**
 * DB interface to interact with a Json Database.
 *
 * @author Olybear, KhaaZ
 *
 * @class JsonProvider
 * @extends ADBProvider
 *
 * @prop {JsonManager} manager - Class responsible to read / write data to the DB as json.
 */
class JsonProvider extends ADBProvider {
    /**
     * Override init method.
     *
     * @param {AxonOptions}
     * @memberof JsonProvider
     */
    init(axonOptions = {} ) { // eslint-disable-next-line no-unused-vars
        this.manager = new JsonManager(axonOptions.extensions.DBLocation);
    }

    // **** INIT **** //

    /**
     * Initialises a default Axon config.
     *
     * @returns {Promise<AxonConfig>} Newly created Axon config from the DB
     * @memberof JsonProvider
     */
    async initAxon() {
        const data = await this.manager.createAxonSchema(this.axon.settings.prefixes[0] );
        return data && new AxonConfig(this.axon, data);
    }

    /**
     * Initialises a default Guild config.
     * Use default AxonClient prefix settings when creating the new guild config.
     *
     * @param {String} gID - Guild ID
     *
     * @returns {Promise<GuildConfig|null>} Newly created Guild config from the DB
     * @memberof JsonProvider
     */
    async initGuild(gID) {
        const data = await this.manager.createGuildSchema(this.axon.settings.prefixes, gID);
        return data && new GuildConfig(this.axon, data);
    }

    // **** FETCH **** //

    /**
     * Retrieves the axon config from the DB
     *
     * @returns {Promise<AxonConfig|null>} AxonSchema Object or null
     * @memberof JsonProvider
     */
    async fetchAxon() {
        const data = await this.manager.fetchAxonSchema();
        return data && new AxonConfig(this.axon, data);
    }

    /**
     * Retrieves the Guild config for the specified guild.
     *
     * @param {String} gID - guild ID
     * @returns {Promise<GuildConfig|null>}
     * @memberof JsonProvider
     */
    async fetchGuild(gID) {
        const data = await this.manager.fetchGuildSchema(gID);
        return data && new GuildConfig(this.axon, data);
    }

    // **** UPDATE **** //

    /**
     * Update AxonConfig in the DB.
     * Update the specific key with the value given as second parameters.
     * Generic method to update Database.
     *
     * @param {String} key - The identifier in the Database
     * @param {updateDBVal} value - The value to update in the DB
     * @returns {Promise<Boolean>} Whether the request was successful or not
     *
     * @memberof JsonProvider
     */
    async updateAxon(key, value) {
        const data = await this.manager.updateAxonKey(key, value);
        return !!data;
    }

    /**
     * Update GuildConfig in the DB.
     * Update the specific key with the value given as third parameters.
     * Specify the guild with the guild ID.
     * Generic method to update Database.
     *
     * @param {String} key - The identifier in the Database
     * @param {String} gID - The guild ID to update
     * @param {updateDBVal} value - The value to update in the DB
     * @returns {Promise<Boolean>} Whether the request was successful or not
     *
     * @memberof JsonProvider
     */
    async updateGuild(key, gID, value) {
        const data = await this.manager.updateGuildKey(gID, key, value);
        return !!data;
    }

    /**
     * Updates the Axon config in the DB with a new Axon config object.
     *
     * @param {AxonConfig|AxonConfigRaw} data - the schema object to update
     * @returns {Promise<AxonConfig|null>} Updated AxonConfig from the DB
     *
     * @memberof JsonProvider
     */
    async saveAxon(data) {
        const res = await this.manager.writeAxonSchema(data);
        return res && new AxonConfig(this.axon, res);
    }

    /**
     * Updates the given guild in the DB with a new schema object.
     *
     * @param {String} gID - Guild id
     * @param {GuildConfig|GuildConfigRaw} data - the schema object to update
     * @returns {Promise<GuildConfig|null>} Updated GuildConfig from the DB
     * @memberof JsonProvider
     */
    async saveGuild(gID, data) {
        const res = await this.manager.writeGuildSchema(gID, data);
        return res && new GuildConfig(this.axon, res);
    }
}

export default JsonProvider;
