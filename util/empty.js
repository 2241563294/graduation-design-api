module.exports = function isEmpty(val) {
	if (val === "" || val === undefined || val === null || val.length === 0) return true;
	 return false;
}