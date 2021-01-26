import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
  FocusEvent
} from 'react';
import Category from '../../../../src/types/Category';
import serverFetch from '../utils/serverFetch';

type AddCategoryType = {
  name: string;
  weight: string | number;
};

type OnChangeCategory = (
  e: ChangeEvent<HTMLInputElement>,
  category: Category
) => void;

type CategoryRowProps = {
  category: AddCategoryType,
  onChangeCategory: OnChangeCategory;
  onBlurCategoryInput?: (e: FocusEvent, category: Category) => void;
  nameInput?: ReactNode;
};

const CategoryRow: FC<CategoryRowProps> = ({
  category,
  onChangeCategory,
  onBlurCategoryInput,
  nameInput
}) => {
  const onBlurProps: {
    onBlur?: (e: FocusEvent) => void;
  } = {};

  if (onBlurCategoryInput) {
    onBlurProps.onBlur = (e: FocusEvent) => {
      onBlurCategoryInput(e, category as Category)
    };
  }

  return (
    <div className='row mb-2' key={category.name}>
      {nameInput ? (
        { nameInput }
      ) : (
          <div className='col-6'>{category.name}</div>
        )}
      <div className='col-6'>
        <input
          id={category.name}
          style={{ width: '100%' }}
          value={category.weight}
          onChange={e => onChangeCategory(e, category as Category)}
          className='form-control'
          {...onBlurProps}
        />
      </div>
    </div>
  )
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
        <div className='row mb-2'
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <div className='col-3 text-right'
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <button
              type='submit'
              className='btn btn-primary'
              onClick={handleAddOnClick}
            >
              Add Category
            </button>
          </div>
        </div>
      )}
      { addCategory && (
        <form onSubmit={handleFormAddSubmit}>
          <div className='form-group'>
            <div className='row mb-2'>
              <div className='col-6'>
                <input
                  id='name'
                  name='name'
                  value={addCategory.name || ''}
                  onChange={e => {
                    setAddCategory({ ...addCategory, name: e.target.value }
                    )
                  }}
                  className='form-control'
                  placeholder='name'
                />
              </div>
              <div className='col-6'>
                <input
                  id='weight'
                  name='weight'
                  value={addCategory.weight || ''}
                  onChange={e => {
                    setAddCategory({ ...addCategory, weight: e.target.value }
                    )
                  }}
                  className='form-control'
                  placeholder='weight'
                />
              </div>
            </div>
            <div className='row mb-2'
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <div className='col-1'>
                <button type='submit' className='btn btn-primary'>Submit</button>
              </div>
              <div className='col-1'>
                <button
                  className='btn btn-danger'
                  onClick={(e: FormEvent<HTMLButtonElement>) => {
                    e.preventDefault();

                    setAddCategory(null as unknown as AddCategoryType)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      <div>
        <div className='row mb-2'>
          <div className='col-6'><strong>Name</strong></div>
          <div className='col-6'><strong>Weight</strong></div>
        </div>
        {
          categories && categories.map((category: Category) => {
            return (
              <CategoryRow
                key={category.name}
                category={category}
                onChangeCategory={onChangeCategory}
                onBlur={onBlurCategoryInput}
              />
            );
          })
        }
      </div>
    </div>
  )
}

export default Index;
