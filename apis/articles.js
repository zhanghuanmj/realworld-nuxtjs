import { request } from '@/plugins/axios';

export const getAllArticles = (params) => {
    return request({
        method: "GET",
        url: '/api/articles',
        params
    })
}

export const getTags = () => {
    return request({
        method: "GET",
        url: '/api/tags'
    })
}

export const getArticlesFeed = (params) => {
    return request({
        method: "GET",
        url: '/api/articles/feed',
        params
    })
}

export const addFavorite = (slug) => {
    return request({
        method: "POST",
        url: `/api/articles/${slug}/favorite`
    })
}

export const delFavorite = (slug) => {
    return request({
        method: "DELETE",
        url: `/api/articles/${slug}/favorite`
    })
}

export const getArticle = (slug) => {
    return request({
        method: "GET",
        url: `/api/articles/${slug}`
    })
}

export const followUser = (username) => {
    return request({
        method: "POST",
        url: `/api/profiles/${username}/follow`
    })
}

export const unFollowUser = (username) => {
    return request({
        method: "DELETE",
        url: `/api/profiles/${username}/follow`
    })
}

export const getComments = (slug) => {
    return request({
        method: "GET",
        url: `/api/articles/${slug}/comments`
    })
}

export const addComment = (slug, data) => {
    return request({
        method: "POST",
        url: `/api/articles/${slug}/comments`,
        data
    })
}

export const delComment = (slug, id) => {
    return request({
        method: "DELETE",
        url: `/api/articles/${slug}/comments/${id}`
    })
}

export const createArticle = (data) => {
    return request({
        method: "POST",
        url: `/api/articles`,
        data
    })
}

export const updateArticle = (slug, data) => {
    return request({
        method: "PUT",
        url: `/api/articles/${slug}`,
        data
    })
}

export const delArticle = (slug) => {
    return request({
        method: "DELETE",
        url: `/api/articles/${slug}`
    })
}
