<template>
  <article class="recipes">
    <section class="recipes__main-view" v-show="!detailViewActive">
      <section class="recipes__search" v-show="recipes.length > 0">
        <input
          class="recipes-search__input"
          type="text"
          v-model="searchQuery"
          placeholder="Search recipe.."
        />
        <button
          class="recipes-search__clear"
          title="Clear search"
          v-on:click="searchQuery=''"
        >&#215;</button>
      </section>
      <section class="recipes__list">
        <div v-if="this.recipes.length === 0" class="recipes-list__empty-text">
          <i>Add a recipe below...</i>
        </div>
        <div class="recipes-list__item" v-for="recipe in filteredRecipes" v-bind:key="recipe.id">
          <a class="recipes-list__title" v-on:click="openRecipe(recipe.id)">{{ recipe.name }}</a>
          <div class="recipes-list__description">{{ recipe.description }}</div>
        </div>
      </section>
      <section class="recipes__add">
        <form v-on:submit.prevent="addRecipe" method="post">
          <input class="recipes-add__name" v-model="newRecipe.name" placeholder="Name" />
          <textarea
            class="recipes-add__description"
            rows="5"
            v-model="newRecipe.description"
            placeholder="Description"
          ></textarea>
          <button title="Add recipie" type="submit">&plus;</button>
        </form>
      </section>
    </section>
    <section class="recipes__detail-view" v-show="detailViewActive">
      <div class="recipes-detail-view__header">
        <button
          title="Back to all recipies"
          class="recipes-detail-view__back-link"
          v-on:click="closeRecipie()"
        >&larrhk;</button>
        <button
          title="Delete recipie"
          class="recipe-detail-view__delete-button"
          v-on:click="deleteRecipe(detailRecipe.id)"
        >&#215;</button>
      </div>
      <div class="recipe-detail-view__title">{{ detailRecipe.name }}</div>
      <div class="recipe-detail-view__description">{{ detailRecipe.description }}</div>
    </section>
  </article>
</template>

<script>
import { gql } from "apollo-boost";
const GET_RECIPES = gql`
  {
    recipes {
      id
      name
      description
    }
  }
`;
// eslint-disable-next-line
const GET_RECIPE_BY_ID = gql`
  query($id: Int!) {
    recipes(where: {id: {_eq: $id} }) {
      id
      name
      description
    }
  }
`;
const ADD_RECIPE = gql`
  mutation insert_recipes($name: String!, $description: String!) {
    insert_recipes(objects: { name: $name, description: $description }) {
      affected_rows
      returning {
        id
        name
        description
      }
    }
  }
`;
const DELETE_RECIPE = gql`
  mutation delete_recipes($id: Int!) {
    delete_recipes(where: { id: { _eq: $id } }) {
      affected_rows
      returning {
        id
        name
        description
      }
    }
  }
`;
export default {
  name: "Recipes",
  data: function() {
    return {
      recipes: [],
      searchQuery: "",
      detailViewActive: false,
      newRecipe: {
        name: "",
        description: ""
      },
      detailRecipe: {}
    };
  },
  apollo: {
    recipes: {
      query: GET_RECIPES
    }
  },
  computed: {
    filteredRecipes: function() {
      let recipes = this.recipes.filter(recipe => {
        return recipe.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
      recipes.sort((a, b) => a.name.localeCompare(b.name));
      return recipes;
    }
  },
  methods: {
    openRecipe: function(recipeId) {
      const selectedRecipe = this.recipes.find(recipe => recipe.id === recipeId);
      this.detailRecipe.id = selectedRecipe.id;
      this.detailRecipe.name = selectedRecipe.name;
      this.detailRecipe.description = selectedRecipe.description;
      this.detailViewActive = true;
    },
    closeRecipie: function() {
      this.detailViewActive = false;
    },
    addRecipe: function() {
      this.$apollo.mutate({
        mutation: ADD_RECIPE,
        variables: {
          name: this.newRecipe.name,
          description: this.newRecipe.description
        },
        update: (cache, { data: { insert_recipes } }) => {
          try {
            const data = cache.readQuery({
              query: GET_RECIPES
            });
            const insertedRecipe = insert_recipes.returning;
            data.recipes.splice(0, 0, insertedRecipe[0]);
            cache.writeQuery({
              query: GET_RECIPES,
              data
            });
          } catch (e) {
            alert(e);
          }
        }
      });
      this.newRecipe.name = "";
      this.newRecipe.description = "";
    },
    deleteRecipe: function(recipeId) {
      this.$apollo.mutate({
        mutation: DELETE_RECIPE,
        variables: {
          id: recipeId
        },
        update: (cache, { data: { delete_recipes } }) => {
          if (delete_recipes.affected_rows) {
            try {
              const data = cache.readQuery({
                query: GET_RECIPES
              });
              data.recipes = data.recipes.filter(t => {
                return t.id !== recipeId;
              });
              cache.writeQuery({
                query: GET_RECIPES,
                data
              });
            } catch (e) {
              alert(e);
            }
          }
        }
      });
      this.closeRecipie();
    }
  }
};
</script>

<style scoped>
.recipes__search {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  display: inline-flex;
}

.recipes-search__clear {
  width: auto;
  padding: 0 1rem;
  margin-left: 0.25rem;
}

.recipes__list {
  list-style-type: none;
  padding: 0 1rem 2rem;
}

.recipes-list__empty-text {
  padding-top: 2rem;
}

.recipes-list__item {
  padding: 0.5rem 0;
}

.recipes-list__title,
.recipe-detail-view__title {
  display: block;
  font-size: 2.5rem;
  padding-bottom: 1rem;
}

.recipes-list__title {
  cursor: pointer;
}

.recipes-list__delete {
  width: auto;
  padding: 1rem;
  margin-top: 0.25rem;
}

.recipes-list__description,
.recipes-list-detail-view__description {
  font-size: 1rem;
}

.recipes__add {
  padding: 1rem;
}

.recipes-add__name,
.recipes-add__description {
  margin-bottom: 0.5rem;
}

.recipes__detail-view {
  padding: 0 1rem 2rem;
  }

.recipes__detail-view button {
  width: 50%;
}

input,
textarea,
button {
  font-size: 1rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ececec;
  box-sizing: border-box;
}

button {
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  background: transparent;
}

button:hover {
  background-color: #ececec;
}
</style>