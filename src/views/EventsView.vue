<template>
    <div class="container">
        <NavigationBar role="Admin" />
        <div class="content">
            <h2 class="title">Events</h2>
            <CampusEvents />
        </div>
    </div>
</template>

<script setup>
import CampusEvents from '../components/CampusEvents.vue';
import NavigationBar from '../components/NavigationBar.vue';

</script>

<style scoped>
.container {
    display: flex;
}

.content {
    margin-left: 24vh;
    padding-top: 0;
    display: flex;
    flex-direction: column;
}

.title {
    margin-top: 12vh;
    margin-left: 20px;
}
</style>