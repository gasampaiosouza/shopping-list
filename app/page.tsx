import ListInput from '@/components/ListInput';
import ListItems from '@/components/ListItems';

export default function Home() {
  return (
    <div className='container md:w-4/12 w-full py-10'>
      <h1 className='text-3xl text-center py-5 font-bold'>My shopping list</h1>

      <ListInput />
      <ListItems />
    </div>
  );
}
