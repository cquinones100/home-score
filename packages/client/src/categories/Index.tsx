import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import Category from '../../../../src/types/Category';
import serverFetch from '../utils/serverFetch';

type AddCategoryType = {
  name: string;
  weight: number;
};

const Index: FC = () => {
  const [categories, setCategories] =
    useState<Category[]>(null as unknown as Category[]);

  const [addCategory, setAddCategory] =
    useState<AddCategoryType>(null as unknown as Category);

  useEffect(() => {
    const fetchCategories = async () => {
      const resp = await serverFetch('/categories');

      const { categories } = await resp.json();

      setCategories(categories);
    };

    if (categories === null) fetchCategories();
  }, [categories]);

  if (!categories) { 
    return <div>Loading...</div>
  }

  const onChangeCategory =
    (e: ChangeEvent<HTMLInputElement>, category: Category) => {
        const newCategories = categories?.map((mapCategory) => {
          if (mapCategory.category_id === category.category_id) {
            return ({
              ...category,
              weight: e.target.value as unknown as number
            })
          } else {
            return mapCategory;
          }
        });

      setCategories(newCategories);
    };

  const onBlurCategoryInput =
    (e: ChangeEvent<HTMLInputElement>, category: Category) => {
      const updateCategory = async () => {
        if (category) {
          await serverFetch(
            `/categories`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(category)
          });
        }
      };

      updateCategory();
    };

  const handleFormAddSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await serverFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(addCategory)
    });

    if (resp.ok) {
      setAddCategory(null as unknown as AddCategoryType);
      setCategories(null as unknown as Category[]);
    }
  };

  const handleAddOnClick = () => {
    setAddCategory({
      weight: 0,
      name: ''
    });
  };

  return (
    <div className='mt-3'>
      { !addCategory && (
        <button
          type='submit'
          className='btn btn-primary'
          onClick={handleAddOnClick}
        >
          Add Category
        </button>
      ) }
      { addCategory && (
        <form onSubmit={handleFormAddSubmit}>
          <div className='mb-2'>
            <label htmlFor='name' className='form-label'>Name</label>
            <input
              id='name'
              name='name'
              value={addCategory.name || ''}
              onChange={e => { setAddCategory({ ...addCategory, name: e.target.value })}}
              className='form-control'
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='weight' className='form-label'>Weight</label>
            <input
              id='weight'
              name='weight'
              value={addCategory.weight || ''}
              onChange={e => { setAddCategory({ ...addCategory, weight: Number(e.target.value) })}}
              className='form-control'
            />
          </div>
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      )}
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {
            categories && categories.map((category: Category) => {
              return (
                <tr key={category.name}>
                  <td>{category.name}</td>
                  <td>
                    <input
                      style={{ width: '100%' }}
                      value={category.weight}
                      onChange={e => onChangeCategory(e, category)}
                      onBlur={e => onBlurCategoryInput(e, category)}
                    />
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Index;
