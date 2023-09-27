import axios from 'axios';
import { ref } from 'vue';

export default function useFetchData() {
  const data = ref<any>(null);
  const error = ref<string | null>(null);

  const fetchData = async () => {
    axios
      .get('/api/getData')
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return { data, error, fetchData };
}
