const findNextId = (data) => {
    const ids = data.map(element => element.id);
    return Math.max(0, ...ids) + 1;
};

const findIndex = (data, id) => {
    id = parseInt(id)
    return data.findIndex(element => element.id === id)
}

exports.findNextId = findNextId;
exports.findIndex = findIndex;
