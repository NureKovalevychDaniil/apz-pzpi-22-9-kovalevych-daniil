package com.example.pzpi_22_9_kovalevych_daniil_lab2.ui

import android.widget.Toast
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.example.pzpi_22_9_kovalevych_daniil_lab2.api.Vehicle
import com.example.pzpi_22_9_kovalevych_daniil_lab2.api.VehicleApi
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VehicleListScreen(modifier: Modifier = Modifier) {
    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    var vehicles by remember { mutableStateOf<List<Vehicle>>(emptyList()) }
    var showDialog by remember { mutableStateOf(false) }
    var confirmDeleteDialog by remember { mutableStateOf(false) }
    var selectedVehicleId by remember { mutableStateOf<Int?>(null) }

    var newModel by remember { mutableStateOf("") }
    var licensePlate by remember { mutableStateOf("") }
    var yearText by remember { mutableStateOf("") }

    fun loadVehicles() {
        coroutineScope.launch {
            try {
                vehicles = VehicleApi.retrofitService.getVehicles()
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(context, "Помилка завантаження", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun addVehicle(model: String, licensePlate: String, year: Int) {
        coroutineScope.launch {
            try {
                val vehicle = Vehicle(
                    id = 0,
                    model = model,
                    license_plate = licensePlate,
                    year = year
                )
                println("📤 Надсилаю: $vehicle")
                VehicleApi.retrofitService.addVehicle(vehicle)
                Toast.makeText(context, "✅ Машину додано", Toast.LENGTH_SHORT).show()
                loadVehicles()
            } catch (e: Exception) {
                println("❌ Помилка при додаванні:")
                e.printStackTrace()
                Toast.makeText(context, "❌ Помилка при додаванні", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun deleteVehicle(id: Int) {
        coroutineScope.launch {
            try {
                VehicleApi.retrofitService.deleteVehicle(id)
                Toast.makeText(context, "🗑️ Машину видалено", Toast.LENGTH_SHORT).show()
                loadVehicles()
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(context, "❌ Помилка при видаленні", Toast.LENGTH_SHORT).show()
            }
        }
    }

    LaunchedEffect(Unit) {
        loadVehicles()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Список машин") },
                actions = {
                    IconButton(onClick = { showDialog = true }) {
                        Icon(Icons.Default.Add, contentDescription = "Додати")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            contentPadding = padding,
            modifier = modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            items(vehicles) { vehicle ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .clickable {
                            selectedVehicleId = vehicle.id
                            confirmDeleteDialog = true
                        }
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Модель: ${vehicle.model}")
                        Text("Номер: ${vehicle.license_plate}")
                        Text("Рік: ${vehicle.year}")
                    }
                }
            }
        }

        // Діалог додавання
        if (showDialog) {
            AlertDialog(
                onDismissRequest = { showDialog = false },
                title = { Text("Нова машина") },
                text = {
                    Column {
                        OutlinedTextField(
                            value = newModel,
                            onValueChange = { newModel = it },
                            label = { Text("Модель") }
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = licensePlate,
                            onValueChange = { licensePlate = it },
                            label = { Text("Номерний знак") }
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = yearText,
                            onValueChange = { yearText = it },
                            label = { Text("Рік випуску") }
                        )
                    }
                },
                confirmButton = {
                    TextButton(onClick = {
                        val year = yearText.toIntOrNull() ?: 2023
                        addVehicle(newModel, licensePlate, year)
                        showDialog = false
                        newModel = ""
                        licensePlate = ""
                        yearText = ""
                    }) {
                        Text("Додати")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showDialog = false }) {
                        Text("Скасувати")
                    }
                }
            )
        }

        // Діалог підтвердження видалення
        if (confirmDeleteDialog) {
            AlertDialog(
                onDismissRequest = { confirmDeleteDialog = false },
                title = { Text("Видалити машину") },
                text = { Text("Ви впевнені, що хочете видалити цю машину?") },
                confirmButton = {
                    TextButton(onClick = {
                        selectedVehicleId?.let { deleteVehicle(it) }
                        confirmDeleteDialog = false
                    }) {
                        Text("Так")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { confirmDeleteDialog = false }) {
                        Text("Скасувати")
                    }
                }
            )
        }
    }
}