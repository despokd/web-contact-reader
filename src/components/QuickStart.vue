<template>
  <v-banner two-line v-model="closed">
    <v-avatar slot="icon" size="40">
      <v-icon>mdi-hand-right</v-icon>
    </v-avatar>
    {{ $t('quickStart') }}
    <template v-slot:actions>
      <v-btn text>
        {{ $t('createContact') }}
      </v-btn>
      <v-btn text>
        {{ $t('importVcf') }}
      </v-btn>
    </template>
  </v-banner>
</template>

<script>
export default {
  closed: false,
};
</script>
