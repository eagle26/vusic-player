const uid = (): string => 'ID_' + Math.random().toString(36).substring(2, 9);

export default uid;
