const findIndex = (data, id) => {
    id = parseInt(id)
    return data.findIndex(element => element.id === id)
}

const parseIntOrNull = num => {
    const parsedNum = parseInt(num);
    return isNaN(parsedNum) ? null : parsedNum;
}

exports.findIndex = findIndex;
exports.parseIntOrNull = parseIntOrNull;
