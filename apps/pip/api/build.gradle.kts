version = "1.0.0"

plugins {
    val kotlinVersion = "1.9.22"
    id("org.jetbrains.kotlin.jvm") version kotlinVersion
    id("com.microsoft.azure.azurefunctions") version "1.16.1"
    id("eclipse")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.microsoft.azure.functions:azure-functions-java-library:3.1.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.15.2")
    implementation("com.azure:azure-cosmos:4.53.0")
    implementation(kotlin("stdlib"))
    
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.1")
    testImplementation("org.mockito:mockito-core:5.8.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

azurefunctions {
    appName = "pip-tracker"
    resourceGroup = "pip-rg"
    region = "canadacentral"
    // runtime configuration removed for now
    localDebug = "transport=dt_socket,server=y,suspend=n,address=5005"
}

// Ensure local.settings.json is propagated correctly to the local runner
tasks.named("azureFunctionsRun") {
    doFirst {
        val settingsFile = file("local.settings.json")
        val exampleFile = file("local.settings.example.json")
        if (!settingsFile.exists() && exampleFile.exists()) {
            println(">>> Creating local.settings.json from example...")
            exampleFile.copyTo(settingsFile)
        }
    }
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "17"
    }
}

tasks.test {
    useJUnitPlatform()
}
