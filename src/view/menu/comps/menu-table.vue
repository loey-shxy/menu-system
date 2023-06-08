<template>
  <div>
    <!-- 竖版 -->
    <el-table 
    v-if="tableType === 'vertical'" 
    ref="table" :data="list" 
    border 
    class="table no-empty menu-table th-color edit" 
    :key="tableKey">
      <el-table-column prop="date" width="220" label="日期" align="center" >
          <template slot-scope="{ row }" >
              <el-date-picker 
              v-model="row.date" 
              type="date" 
              placeholder="请选择日期" 
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd" 
              :editable="false"
              @change="changeDate(row)"></el-date-picker>
              <span style="margin-top: .25rem; display: inline-block;">{{row.week}} </span>
              <div>
                <i class="el-icon-remove icon" @click="removeDate(row)"></i>
                <i class="el-icon-circle-plus icon" @click="addDate"></i>
              </div>
          </template>
      </el-table-column>
      <el-table-column  align="center" v-if="addedMeal.includes('breakfasts')" class-name="td-breakfasts">
          <template slot="header" slot-scope="scope">
            <div class="label font-color">早餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('breakfasts')"></i>
              <i class="el-icon-circle-plus icon" v-if="meals.length" @click="openAdd"></i>
            </div>
          </template>
          <template slot-scope="{ row, $index }" >
              <div class="dishes__cell">
                <draggable class="draggable-group" :list="row.breakfasts?row.breakfasts:[]" group="meal" @change="log">
                  <div 
                  v-for="(item, index) in row.breakfasts" 
                  :key="`vertical-breakfasts-${row.date}-${index}`" 
                  class="cell-dishes">
                    <div 
                    class="dishes-span"
                    >
                        {{ item.dishesName }}
                        <i class="el-icon-close" @click="removeFood('breakfasts', row, index)"></i>
                    </div>
                  </div>
                  <div class="cell-dishes" slot="footer">
                    <el-button round plain class="block" @click="addFood(4, $index)">添加菜品</el-button>
                  </div>
                </draggable>
              </div>
          </template>
      </el-table-column>
      <el-table-column align="center" v-if="addedMeal.includes('lunches')" class-name="td-lunches">
        <template slot="header" slot-scope="scope">
            <div class="label font-color">午餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('lunches')"></i>
              <i class="el-icon-circle-plus icon" v-if="meals.length" @click="openAdd"></i>
            </div>
          </template>
          <template slot-scope="{ row, $index }">
              <div class="dishes__cell">
                  <draggable class="draggable-group" :list="row.lunches?row.lunches:[]" group="meal" @change="log">
                    <div 
                      v-for="(item, index) in row.lunches" 
                      :key="`vertical-lunches-${row.date}-${index}`" 
                      class="cell-dishes">
                      <div 
                        class="dishes-span">
                        {{ item.dishesName }}
                        <i class="el-icon-close" @click="removeFood('lunches', row, index)"></i>
                      </div>
                    </div>
                    <div class="cell-dishes" slot="footer">
                      <el-button round plain class="block" @click="addFood(5, $index)">添加菜品</el-button>
                    </div>
                  </draggable>
              </div>
          </template>
      
      </el-table-column>
      <el-table-column align="center" v-if="addedMeal.includes('dinners')" class-name="td-dinner">
        <template slot="header" slot-scope="{ row }">
            <div class="label font-color">晚餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('dinners')"></i>
              <i class="el-icon-circle-plus icon" v-if="meals.length" @click="openAdd"></i>
            </div>
          </template>
          <template slot-scope="{ row, $index }">
              <div class="dishes__cell">
                <draggable class="draggable-group" :list="row.dinners?row.dinners:[]" group="meal" @change="log">
                  <div 
                  v-for="(item, index) in row.dinners" 
                  :key="`vertical-dinners-${row.date}-${index}`" 
                  class="cell-dishes">
                      <div 
                      class="dishes-span"
                      >
                        {{ item.dishesName }}
                        <i class="el-icon-close" @click="removeFood('dinners', row, index)"></i>
                      </div>
                  </div>
                  <div class="cell-dishes" slot="footer">
                    <el-button round plain class="block" @click="addFood(6, $index)">添加菜品</el-button>
                  </div>
                </draggable>
              </div>
          </template>
      </el-table-column>
      <el-table-column label="菜量" align="center" width="320">
          <template slot-scope="{ row }" >
              <el-row :gutter="10">
                  <el-col :span="12" v-for="material in row.materialList" :key="`material-${material.materialId}-${row.date}`" style="text-align:left;">
                      {{material.materialName}}({{material.materialNum}}{{material.materialUnitDesc}})
                  </el-col>
              </el-row>
          </template>
      </el-table-column>
    </el-table>

    <!-- 横版 -->
    <div class="horizontal-table edit" v-if="tableType === 'horizontal'">
      <div class="table__head">
        <div class="date">日期</div>
        <div class="cell" v-for="(row, $index) in list" :key="`${row.date}-${$index}`">
          <div>
            <el-date-picker 
            v-model="row.date" 
            type="date" 
            placeholder="请选择日期" 
            format="yyyy-MM-dd" 
            value-format="yyyy-MM-dd" 
            @change="changeDate(row)"></el-date-picker>
            <div class="thead-icons">
              <i class="el-icon-remove icon" @click="removeDate(row)"></i>
              <i class="el-icon-circle-plus icon" @click="addDate"></i>
            </div>
          </div>
          <div>{{ row.week }}</div>
        </div>
      </div>
      <div class="table__body">
        <div class="row" v-if="addedMeal.includes('breakfasts')">
          <div class="date">
            <div class="label">早餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('breakfasts')"></i>
              <i class="el-icon-circle-plus icon" @click="openAdd" v-if="meals.length"></i>
            </div>
          </div>
          <div 
          class="cell" 
          v-for="(row, $index) in list" 
          :key="`breakfasts-${row.date}-${$index}`">
            <draggable class="draggable-group" :list="row.breakfasts?row.breakfasts:[]" group="meal" @change="log">
              <div 
                v-for="(item, index) in row.breakfasts" 
                :key="`horizontal-breakfasts-${row.date}-${item.dishesId}-${index}`" 
                class="cell-dishes">
                <div class="dishes-span">
                  {{ item.dishesName }}
                  <i class="el-icon-close" @click="removeFood('breakfasts', row, index)"></i>
                </div>
              </div>
              <div class="cell-dishes" slot="footer">
                <el-button plain round class="block" @click="addFood(4, $index)">添加菜品</el-button>
              </div>
            </draggable>
          </div>
        </div>
        <div class="row" v-if="addedMeal.includes('lunches')">
          <div class="date">
            <div class="label">午餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('lunches')"></i>
              <i class="el-icon-circle-plus icon" @click="openAdd" v-if="meals.length"></i>
            </div>
          </div>
          <div 
          class="cell" 
          v-for="(row, $index) in list" 
          :key="`lunches-${row.date}-${$index}`">
            <draggable class="draggable-group" :list="row.lunches?row.lunches:[]" group="meal" @change="log">
              <div v-for="(item, index) in row.lunches" :key="`horizontal-lunches-${row.date}-${item.dishesId}-${index}`" class="cell-dishes">
                <div class="dishes-span">
                  {{ item.dishesName }}
                  <i class="el-icon-close" @click="removeFood('lunches', row, index)"></i>
                </div>
              </div>
              <div class="cell-dishes" slot="footer">
                <el-button plain round class="block" @click="addFood(5, $index)">添加菜品</el-button>
              </div>
            </draggable>
          </div>
        </div>
        <div class="row" v-if="addedMeal.includes('dinners')">
          <div class="date">
            <div class="label">晚餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('dinners')"></i>
              <i class="el-icon-circle-plus icon" @click="openAdd" v-if="meals.length"></i>
            </div>
          </div>
          <div 
          class="cell" 
          v-for="(row, $index) in list" 
          :key="`dinners-${row.date}-${$index}`">
            <draggable class="draggable-group" :list="row.lunches?row.lunches:[]" group="meal" @change="log">
              <div v-for="(item, index) in row.dinners" :key="`horizontal-dinners-${row.date}-${item.dishesId}-${index}`" class="cell-dishes">
                <div class="dishes-span">
                  {{ item.dishesName }}
                  <i class="el-icon-close" @click="removeFood('dinners', row, index)"></i>
                </div>
              </div>
              <div class="cell-dishes" slot="footer">
                <el-button plain round class="block" @click="addFood(6, $index)">添加菜品</el-button>
              </div>
            </draggable>
          </div>
        </div>
        <div class="row">
          <div class="date">菜<br />量</div>
          <div class="cell" v-for="(item, $index) in list" :key="`material-${item.date}-${$index}`">
            <el-row :gutter="20">
                  <el-col v-for="itemM in item.materialList" :key="itemM.materialId" style="line-height: .24rem; text-align:left; padding-left:.2rem" >
                      <span>{{itemM.materialName}}({{itemM.materialNum}}{{itemM.materialUnitDesc}})</span>
                  </el-col>
              </el-row>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title=""
      :visible.sync="popVisible"
      width="30%"
      :before-close="close">
      <el-radio-group v-model="meal">
        <el-radio v-for="meal in meals" :key="meal.val" :value="meal.val" :label="meal.val">{{ meal.name }}</el-radio>
      </el-radio-group>
      <div slot="footer" class="operate flex justify-center">
        <div class="btn background-color" @click="addMeal">确定</div>
        <div class="btn default" @click="close">取消</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  directives: {
    'el-select-lazyloading': {
      bind(el, binding) {
        const SELECT_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECT_DOM.addEventListener('scroll', function() {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  components: {
    draggable
  },
  props: {
    tableType: {
      type: String,
      default: 'vertical'
    },
    list: {
      type: Array,
      default: () => []
    },
    dishesSelectList: {
      type: Array,
      default: () => []
    },
    foodTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      popVisible: false,
      meal: '',
      tableKey: 1,
      dragIndex: -1,
      dragMeal: {},
      originIndex: -1
    }
  },
  computed: {
    meals() {
      let meals = [
        { val: 'breakfasts', name: '早餐' },
        { val: 'lunches', name: '午餐' },
        { val: 'dinners', name: '晚餐' }
      ]

      meals = meals.filter(item => !this.addedMeal.includes(item.val))

      return meals
    },
    addedMeal() {
      if (!this.list.length) {
        return ''
      }
      let meal = []
      if (this.list.some(item => item.breakfasts)) {
        meal = ['breakfasts']
      }

      if (this.list.some(item => item.lunches)) {
        meal = [...meal, 'lunches']
      }

      if (this.list.some(item => item.dinners)) {
        meal = [...meal, 'dinners']
      }
      return meal
    }
  },
  methods: {
    lazyloading() {
      this.$emit('lazyloading')
    },
    changeDate(row) {
      this.$emit('change-date', row)
    },
    close() {
      this.meal = ''
      this.popVisible = false
    },
    openAdd() {
      this.popVisible = true
    },
    addMeal() {
      if (this.meal) {
        this.list.forEach(item => {
          this.$set(item, this.meal, [])
        })
      }
      this.popVisible = false
    },
    addDate() {
      this.list.push({
        date: '',
        week: '',
        breakfasts: [],
        lunches: [],
        dinners: [],
        materialList: []
      })
    },
    removeDate(row) {
      const index = this.list.findIndex(item => item.date === row.date)
      if (index >= 0) {
        this.list.splice(index, 1)
      }
    },
    removeMeal(mealType) {
      this.list.forEach((row, index) => {
        this.$delete(this.list[index], mealType)
      })
      this.tableKey = Date.now()
    },
    addFood(type, index) {
      this.$emit('add-food', type, index)
    },
    removeFood(mealType, row, index) {
      row[mealType].splice(index, 1)
    },
    log(e) {
      console.log(e)
    }
  }
}
</script>
<style scoped>
.td-content {
  height: 100%;
}
.draggable-group {
  height: 100%;
}
</style>