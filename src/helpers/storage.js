/**
 * Storage API helper method that sets a key/value in specified storage API with
 *   an optional cache duration in minutes
 * @private
 * @sauce  https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
 *
 * @param  {object}   StorageAPI          Storage API object to use for .getItem() calls
 * @param  {string}   key                 A DOMString containing the name of the key you want to create/update
 * @param  {any}      value               The value you want to give the key you are creating/updating
 * @param  {integer}  durationInMinutes   The time in minutes the item should be valid for, used for passively expiring cache
 * @return {any}                          The initial value data
 */
function _setItem(StorageAPI, key, value, durationInMinutes=-1) {

    const MINUTES = 1000 * 60

    // if durationInMinutes is greater than 0 minutes, calc the expiration time in microseconds
    let expires = durationInMinutes > 0
        ? new Date().getTime() + (Math.abs(durationInMinutes) * MINUTES)
        : null

    // NOTE: this uses ES6 Object property shorthand, modify as necessary
    // @sauce: https://alligator.io/js/object-property-shorthand-es6/

    let data = JSON.stringify({
        expires,
        value,
    })

    StorageAPI.setItem(key, data)

    return value
}



/**
 * Storage API helper method to verify item cache before returning the desired data
 * @private
 * @sauce  https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
 *
 * @param  {object}   StorageAPI  Storage API object to use for .getItem() calls
 * @param  {string}   key         A DOMString containing the name of the key you want to create/update
 * @return {boolean}  false       If the storage item does not exist, or is expired, returns false
 * @return {any}      value       If the storage item exists and is not expired, returns the stored data
 */
function _getItem(StorageAPI, key) {
    let data = JSON.parse(StorageAPI.getItem(key))

    // check if storage key value exists
    if (!data) {
        return false
    }

    // check if storage key is expired
    if (data.expires && data.expires < new Date().getTime()) {
        return false
    }

    return data.value
}



/**
 * Alias of storage.removeItem method
 * @private
 * @sauce  https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem
 *
 * @param  {object}   StorageAPI  The storage API object to be used (eg: localStorage, sessionStorage)
 * @param  {string}   key         A DOMString containing the name of the key you want to delete
 * @return {boolean}              Returns true or false if the item was successfully deleted
 */
function _deleteItem(StorageAPI, key) {
    StorageAPI.removeItem(key)

    return StorageAPI.getItem(key) ? true : false
}



/**
 * Storage aliases of StorageAPI.setItem() with optional cache duration in minutes
 * @param  {string}   key               A DOMString containing the name of the key you want to create/update
 * @param  {any}      value             The value you want to give the key you are creating/updating
 * @param  {integer}  durationInMinutes An Integer of time in minutes you wish this value to be valid for
 * @return {any}                        The initial value data
 */
export function lsSetItem(key, value, durationInMinutes = 0) { return _setItem(localStorage, key, value, durationInMinutes) }
export function ssSetItem(key, value, durationInMinutes = 0) { return _setItem(sessionStorage, key, value, durationInMinutes) }



/**
 * Storage aliases of StorageAPI.getItem()
 * @param  {string}   key     A DOMString containing the name of the key you want to recall
 * @return {any}              The initial value data
 */
export function lsGetItem(key) { return _getItem(localStorage, key) }
export function ssGetItem(key) { return _getItem(sessionStorage, key) }



/**
 * Storage aliases of StorageAPI.removeItem()
 * @param  {string}   key     A DOMString containing the name of the key you want to delete
 * @return {boolean}          True if the deletion was successful
 */
export function lsDeleteItem(key) { return _deleteItem(localStorage, key) }
export function ssDeleteItem(key) { return _deleteItem(sessionStorage, key) }
