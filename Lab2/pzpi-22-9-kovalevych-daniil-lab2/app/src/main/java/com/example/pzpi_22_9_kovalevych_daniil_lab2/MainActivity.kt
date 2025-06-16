package com.example.pzpi_22_9_kovalevych_daniil_lab2

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.pzpi_22_9_kovalevych_daniil_lab2.ui.VehicleListScreen
import com.example.pzpi_22_9_kovalevych_daniil_lab2.ui.theme.Pzpi229kovalevychdaniillab2Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Pzpi229kovalevychdaniillab2Theme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    VehicleListScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}