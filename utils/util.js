module.exports = function flatten(arr) {
    return arr.reduce(function (accumulation, value) {
        return accumulation.concat(
            Array.isArray(value) ? flatten(value) : value
        );
    }, []);
};
