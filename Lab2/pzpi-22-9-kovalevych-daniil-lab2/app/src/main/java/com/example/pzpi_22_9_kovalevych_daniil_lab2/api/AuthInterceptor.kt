package com.example.pzpi_22_9_kovalevych_daniil_lab2.api

import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val username: String) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request().newBuilder()
            .addHeader("Authorization", username) // ⬅️ просто логін
            .build()
        return chain.proceed(request)
    }
}