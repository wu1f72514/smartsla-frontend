<template>
  <user-profile></user-profile>
</template>

<script>
import userProfile from "@/components/user/userProfile.vue";
export default {
  name: "profile",
  components: {
    userProfile: userProfile
  }
};
</script>
