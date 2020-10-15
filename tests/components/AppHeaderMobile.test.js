import { shallowMount } from '@vue/test-utils';

import AppHeaderMobile from '~/components/AppHeader/AppHeaderMobile.vue';

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve([
    {
      absolute_url: '/catalog/strojmaterialy/',
      id: 100443,
      name: 'Стройматериалы',
      product_count: 7903,
      short_name: null,
      slug: 'strojmaterialy',
      submenu: [{
        name: 'Блоки строительные',
      }],
    },
  ]),
}));

describe('App Header on Mobile', () => {
  window.innerWidth = 500;
  const wrapper = shallowMount(AppHeaderMobile, {});
  wrapper.find('.header__btn--menu').trigger('click');
  it('renders correctly', () => {
    expect(wrapper.find('.header__wrapper').html()).toMatchSnapshot();
  });
  it('proceeds clicks', async () => {
    await wrapper
      .findAll('.header-menu__item')
      .at(3)
      .trigger('click');
    expect(wrapper.find('.header-menu__link').html()).toMatchSnapshot();
  });
});
