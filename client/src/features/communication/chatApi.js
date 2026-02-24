import api from '../../services/apiClient'


// access chat or create chat 
const accessChat = async (userData) => {
    const res = await api.post('/chat/access-chat', userData, { withCredentials: true })
    return res.data
}

// create Group

const createGroup = async (groupData) => {
    const res = await api.post('/chat/create-group', groupData, { withCredentials: true })
    return res.data
}


// send message 

const sendMessage = async (messageData) => {
    const res = await api.post('/chat/send-message', messageData, { withCredentials: true })
    return res.data
}


// fetch message 
const allMessage = async (chatId) => {
    const res = await api.get(`/chat/message/${chatId}`, { withCredentials: true })
    return res.data
}