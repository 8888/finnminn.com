version = "1.0.0"

plugins {
    val kotlinVersion = "1.9.22"
    id("org.jetbrains.kotlin.jvm") version kotlinVersion
    id("com.microsoft.azure.azurefunctions") version "1.16.1"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.microsoft.azure.functions:azure-functions-java-library:3.1.0")
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

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "21"
    }
}

tasks.test {
    useJUnitPlatform()
}
