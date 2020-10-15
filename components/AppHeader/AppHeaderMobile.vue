<template>
  <div class="header">
    <div class="header__container">
      <div class="header__row">
        <button class="header__btn header__btn--menu" aria-label="Меню" @click="toggleActive">
          <Icon class="header__icon header__icon--burger" name="nav-burger" v-if="!isActive" />
          <Icon class="header__icon header__icon--burger" name="nav-close" v-else />
        </button>
        <AppHeaderLogo class="header__logo" />
        <AppHeaderUserMenu class="header__user-menu" />
      </div>
      <div class="header__row">
        <AppHeaderCatalogBtn class="header__btn header__btn--catalog" />
        <AppSearch class="header__search" />
      </div>
    </div>
    <div class="header__wrapper header__wrapper--menu" v-if="isActive">
      <ul class="header-menu" v-if="activeAt==='menu'">
        <li class="header-menu__item">
          <button class="header-menu__link">
            Прайс-лист
          </button>
        </li>
        <li class="header-menu__item">
          <button class="header-menu__link">
            Отслеживание заказа
          </button>
        </li>
        <li class="header-menu__item">
          <button class="header-menu__link" @click="activateCatalog">
            Каталог товаров
          </button>
        </li>
        <li class="header-menu__item">
          <nuxt-link class="header-menu__link" to="/info/delivery/">
            Доставка
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </nuxt-link>
        </li>
        <li class="header-menu__item">
          <nuxt-link class="header-menu__link" to="/about/">
            О компании
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </nuxt-link>
        </li>
        <li class="header-menu__item">
          <nuxt-link class="header-menu__link" to="/info/contacts/">
            Контакты
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </nuxt-link>
        </li>
        <li class="header-menu__item">
          <ExternalLink class="header-menu__link" href="https://gdematerial.ru/blog/" target="_blank">
            Блог
          </ExternalLink>
        </li>
        <li class="header-menu__item">
          <ExternalLink class="header-menu__link" href="https://partner.gdml.ru" target="_blank">
            Поставщикам
          </ExternalLink>
        </li>
      </ul>
      <ul class="header-menu header-menu--catalog" v-if="activeAt==='catalog'">
        <li class="header-menu__item header-menu__item--link-back" v-if="currentSubtreeIndex > 0">
          <button
            class="header-menu__link"
            @click="setPreviousItems"
          >
            <Icon class="header-menu__icon header-menu__icon--angle-left" name="gm-angle-right" />
            {{ itemsStack[currentSubtreeIndex].name || 'Каталог товаров' }}
          </button>
        </li>
        <li class="header-menu__item" v-for="item of itemsStack[currentSubtreeIndex].submenu" :key="item.id">
          <button
            class="header-menu__link"
            @click="setNewItems(item)"
            v-if="item.submenu"
          >
            {{ item.name }}
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </button>
          <nuxt-link
            class="header-menu__link"
            :to="{ path: item.absolute_url }"
            v-else
          >
            {{ item.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppHeaderLogo from '~/components/AppHeader/AppHeaderLogo.vue';
import AppHeaderUserMenu from '~/components/AppHeader/mobile/AppHeaderUserMenu.vue';
import AppHeaderCatalogBtn from '~/components/AppHeader/buttons/AppHeaderCatalogBtn.vue';
import AppSearch from '~/components/AppSearch/AppSearch.vue';
import ExternalLink from '~/components/ExternalLink.vue';

export default {
  components: {
    AppHeaderLogo,
    AppHeaderUserMenu,
    AppHeaderCatalogBtn,
    AppSearch,
    ExternalLink,
  },
  data() {
    return {
      itemsStack: [],
      currentSubtreeIndex: 0,
      activeItemName: '',
      isActive: false,
      activeAt: '',
    };
  },
  watch: {
    activeAt() {
      if (this.activeAt) {
        document.querySelector('body').style = `
          position: fixed;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          overflow-y: scroll;
        `;
      }
    },
  },
  async mounted() {
    const response = await fetch('https://web.gdml.ru/api/v1/categories_tree/');
    const items = await response.json();
    this.itemsStack.push({
      name: 'Все категории',
      submenu: items,
    });
  },
  methods: {
    toggleActive() {
      if (!this.activeAt) {
        this.activeAt = 'menu';
      } else {
        this.activeAt = '';
      }
      this.isActive = !this.isActive;
      this.currentSubtreeIndex = 0;
    },
    activateCatalog() {
      this.activeAt = 'catalog';
    },
    setNewItems(items) {
      this.itemsStack[++this.currentSubtreeIndex] = items;
    },
    setPreviousItems() {
      this.currentSubtreeIndex--;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  &__container {
    max-width: $container-xl;
    padding: 10px 8px 10px 8px;
    margin: 0 auto;
  }

  &__row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__user-menu {
    margin-left: auto;
  }

  &__search {
    flex-grow: 1;
  }

  &__wrapper {
    height: 520px;
    background-color: hsl(0, 0%, 100%);
  }

  &__btn {
    flex-shrink: 0;

    &--menu {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin-right: 18px;
      color: hsl(0, 0%, 0%);
      cursor: pointer;
      background-color: transparent;
      border: none;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      transition: visibility 3s;
    }

    &--catalog {
      margin-right: 5px;
    }
  }

  &__icon {
    &--burger {
      width: 20px;
      height: 14px;
    }
  }
}

.header-menu {
  --link-background-color: hsl(0, 0%, 100%);
  --link-border-radius: 0;
  --link-padding: 6px 8px;
  --link-color: hsl(198, 23%, 19%);
  --link-outline-color: transparent;
  --icon--angle-right-color: hsl(199, 22%, 77%);

  padding: 0;
  overflow-y: scroll;
  list-style: none;
  background-color: hsl(0, 0%, 100%);

  &__item {
    @media (min-width: $screen-lg) {
      --link-padding: 7px 20px;
    }

    &--link-back > button {
      font-weight: 700;
      text-align: end;
      background-color: hsl(215, 40%, 94%);
    }

    &:hover,
    &--active {
      --link-background-color: hsl(230, 78%, 51%);
      --link-color: hsl(0, 0%, 100%);
      --link-outline-color: hsl(230, 78%, 51%);
      --icon--angle-right-color: hsl(0, 0%, 100%);
    }

    &:first-child {
      margin-top: 10px;

      @media (min-width: $screen-lg) {
        --link-padding: 16px 20px 10px 20px;
      }
    }

    &:last-child {
      @media (min-width: $screen-lg) {
        --link-padding: 10px 20px 16px 20px;
      }
    }
  }

  &__link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--link-padding);
    font-family: $font-family-montserrat;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: var(--link-color);
    text-align: start;
    cursor: pointer;
    background-color: var(--link-background-color);
    border: 1px solid transparent;
    border-radius: var(--link-border-radius);
    outline: none;
    -webkit-tap-highlight-color: transparent;

    @media (min-width: $screen-lg) {
      outline: 3px solid var(--link-outline-color);
    }
  }

  &__icon {
    flex-shrink: 0;

    &--angle-right {
      width: 6px;
      height: 20px;
      margin-left: 8px;
      color: var(--icon--angle-right-color);

      @media (min-width: $screen-lg) {
        margin-left: 10px;
      }
    }

    &--angle-left {
      width: 6px;
      height: 20px;
      margin-left: 8px;
      color: var(--icon--angle-right-color);
      transform: rotate(180deg);

      @media (min-width: $screen-lg) {
        margin-left: 10px;
      }
    }
  }
}
</style>
