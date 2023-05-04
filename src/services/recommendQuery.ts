import axios from 'axios';

export const getItemsFromAPI = async (value: string) => {
  try {
    console.info('calling api');
    const itemsRes = await axios({
      method: 'get',
      url: `api/v1/search-conditions/?name=${value}`,
    });

    return itemsRes.data.length > 0 ? itemsRes.data : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
