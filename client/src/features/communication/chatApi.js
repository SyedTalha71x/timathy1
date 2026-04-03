import api from '../../services/apiClient'


// access chat or create chat 
export const accessChat = async (userData) => {
    const res = await api.post('/chat/access-chat', userData, { withCredentials: true })
    return res.data
}

// create Group

export const createGroup = async (groupData) => {
    const res = await api.post('/chat/create-group', groupData, { withCredentials: true })
    return res.data
}


// send message 

export const sendMessage = async (messageData) => {
    const res = await api.post('/chat/send-message', messageData, { withCredentials: true })
    return res.data
}


// delete message 

export const deleteMessageApi = async (messageId) => {
    const res = await api.delete(`/chat/message/${messageId}`, { withCredentials: true })
    return res.data
}

// fetch message 
export const allMessage = async (chatId) => {
    const res = await api.get(`/chat/message/${chatId}`, { withCredentials: true })
    return res.data
}



// access Studio Chat 

export const accessStudioChat = async (chatData) => {
    const res = await api.post('/chat/studio/access', chatData, { withCredentials: true })
    return res.data;
}

// fetch all studio chat

export const fetchStudioChat = async () => {
    const res = await api.get('/chat/studio/chats', { withCredentials: true })
    return res.data;
}


// All member Chat with studio

export const fetchMemberChatApi = async () => {
    const res = await api.get('/chat/member', { withCredentials: true })
    return res.data
}

// fetch all staff chat history 
export const fetchStaffAllChatApi = async () => {
    const res = await api.get('/chat/all', { withCredentials: true })
    return res.data
}