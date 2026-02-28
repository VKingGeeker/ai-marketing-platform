<template>
  <div class="feature-card" @click="$emit('click')">
    <div class="card-icon">
      <el-icon :size="48">
        <component :is="icon" />
      </el-icon>
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-description">{{ description }}</p>
    <div class="card-action">
      <span>立即体验</span>
      <el-icon class="arrow-icon"><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transition: transform var(--transition);
}

.feature-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-8px);
  border-color: var(--primary-color);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-light), rgba(16, 185, 129, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  color: var(--primary-color);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.card-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-lg);
}

.card-action {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--primary-color);
  font-weight: 500;
  font-size: 14px;
}

.arrow-icon {
  transition: transform var(--transition);
}

.feature-card:hover .arrow-icon {
  transform: translateX(4px);
}
</style>
