package com.example.pzpi_22_9_kovalevych_daniil_lab2.api

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.DELETE
import retrofit2.http.Path

// ОНОВЛЕНА модель машини — тепер включає всі потрібні поля
data class Vehicle(
    val id: Int = 0,
    val model: String,
    val license_plate: String,
    val year: Int
)

// Retrofit-сервіс
interface VehicleService {
    @GET("/vehicles")
    suspend fun getVehicles(): List<Vehicle>

    @POST("/vehicles")
    suspend fun addVehicle(@Body vehicle: Vehicle)

    @DELETE("/vehicles/{id}")
    suspend fun deleteVehicle(@Path("id") id: Int)
}

// 🔐 Підключення до API з авторизацією
object VehicleApi {
    private const val BASE_URL = "http://10.0.2.2:8080"
    private const val USERNAME = "admin" // або інший логін, що є в БД

    private val client = OkHttpClient.Builder()
        .addInterceptor(AuthInterceptor(USERNAME))
        .build()

    val retrofitService: VehicleService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(client) // обов’язково
            .build()
            .create(VehicleService::class.java)
    }
}