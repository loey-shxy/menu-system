<template>
  <div>
    <!-- 竖版 -->
    <el-table 
    v-if="tableType === 'vertical'" 
    ref="table" :data="list" 
    border 
    class="table no-empty menu-table th-color edit" 
    :key="tableKey"
    :cell-class-name="tableCellClassName">
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
      <el-table-column  align="center" v-if="addedMeal.includes('breakfasts')">
          <template slot="header" slot-scope="scope">
            <div class="label font-color">早餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('breakfasts')"></i>
              <i class="el-icon-circle-plus icon" v-if="meals.length" @click="openAdd"></i>
            </div>
          </template>
          <template slot-scope="{ row, $index }" >
              <div>
                  <div v-for="(item, index) in row.breakfasts" :key="`vertical-breakfasts-${row.date}-${index}`" class="cell-dishes">
                      <el-select 
                      filterable 
                      clearable 
                      v-el-select-lazyloading="lazyloading" 
                      v-model="item.dishesId" 
                      @change="selectDishes(row, 'breakfasts', item.dishesId, index)">
                          <el-option 
                          v-for="(dishes, dIndex) in dishesSelectList" 
                          :key="`breakfasts-select-${row.date}-${dishes.dishesId}-${dIndex}`" 
                          :value="dishes.dishesId" 
                          :label="dishes.dishesName"
                          :disabled="row.breakfasts.map(item => item.dishesId).includes(dishes.dishesId)"></el-option>
                      </el-select>
                      <i class="el-icon-circle-close" @click="removeFood('breakfasts', row, index)"></i>
                  </div>
                  <div class="cell-dishes">
                    <el-button round plain class="block" @click="addFood('breakfasts', row)">添加菜品</el-button>
                      <i class="el-icon-circle-close" hidden></i>
                  </div>
              </div>
          </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" v-if="addedMeal.includes('lunches')">
        <template slot="header" slot-scope="scope">
            <div class="label font-color">午餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('lunches')"></i>
              <i class="el-icon-circle-plus icon" v-if="meals.length" @click="openAdd"></i>
            </div>
          </template>
          <template slot-scope="{ row, $index }">
              <div>
                  <div v-for="(item, index) in row.lunches" :key="`vertical-lunches-${row.date}-${index}`" class="cell-dishes">
                      <el-select 
                      filterable 
                      clearable 
                      v-el-select-lazyloading="lazyloading" 
                      v-model="item.dishesId"
                      @change="selectDishes(row, 'lunches', item.dishesId, index)">
                          <el-option 
                          v-for="(dishes, dIndex) in dishesSelectList" 
                          :key="`lunches-select-${row.date}-${dishes.dishesId}-${dIndex}`" 
                          :value="dishes.dishesId" 
                          :label="dishes.dishesName"
                          :disabled="row.lunches.map(item => item.dishesId).includes(dishes.dishesId)">
                          </el-option>
                      </el-select>
                      <i class="el-icon-circle-close" @click="removeFood('lunches', row, index)"></i>
                  </div>
                  <div class="cell-dishes">
                    <el-button round plain class="block" @click="addFood('lunches', row)">添加菜品</el-button>
                      <i class="el-icon-circle-close" hidden></i>
                  </div>
              </div>
          </template>
      
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" v-if="addedMeal.includes('dinners')">
        <template slot="header" slot-scope="{ row }">
            <div class="label font-color">晚餐</div>
            <div>
              <i class="el-icon-remove icon" @click="removeMeal('dinners')"></i>
              <i class="el-icon-circle-plus icon" v-if="meals.length" @click="openAdd"></i>
            </div>
          </template>
          <template slot-scope="{ row, $index }">
              <div>
                  <div v-for="(item, index) in row.dinners" :key="`vertical-dinners-${row.date}-${index}`" class="cell-dishes">
                      <el-select 
                      filterable 
                      clearable 
                      v-el-select-lazyloading="lazyloading" 
                      v-model="item.dishesId"
                      @change="selectDishes(row, 'dinners', item.dishesId, index)">
                        <el-option 
                        v-for="(dishes, dIndex) in dishesSelectList" 
                        :key="`dinners-select-${row.date}-${dishes.dishesId}-${dIndex}`" 
                        :value="dishes.dishesId" 
                        :label="dishes.dishesName"
                        :disabled="row.dinners.map(item => item.dishesId).includes(dishes.dishesId)"></el-option>
                      </el-select>
                      <i class="el-icon-circle-close" @click="removeFood('dinners', row, index)"></i>
                  </div>
                  <div class="cell-dishes">
                    <el-button round plain class="block" @click="addFood('dinners', row)">添加菜品</el-button>
                      <i class="el-icon-circle-close" hidden></i>
                  </div>
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
          <div class="cell" v-for="(row, $index) in list" :key="`breakfasts-${row.date}-${$index}`">
            <div v-for="(item, index) in row.breakfasts" :key="`horizontal-breakfasts-${row.date}-${item.dishesId}-${index}`" class="cell-dishes">
              <el-select 
              filterable 
              clearable 
              v-model="item.dishesId"
              @change="selectDishes(row, 'breakfasts', item.dishesId, index)">
                <el-option 
                v-for="(dishes, dIndex) in dishesSelectList" 
                :key="`breakfasts-option-${row}-${dishes.dishesId}-${dIndex}`" 
                :value="dishes.dishesId" 
                :label="dishes.dishesName"
                :disabled="row.breakfasts.map(item => item.dishesId).includes(dishes.dishesId)"></el-option>
              </el-select>
              <i class="el-icon-circle-close" @click="removeFood('breakfasts', row, index)"></i>
            </div>
            <div class="cell-dishes">
              <el-button plain round class="block" @click="addFood('breakfasts', row)">添加菜品</el-button>
              <i class="el-icon-circle-close" hidden></i>
            </div>
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
          <div class="cell" v-for="(row, $index) in list" :key="`lunches-${row.date}-${$index}`">
            <div v-for="(item, index) in row.lunches" :key="`horizontal-lunches-${row.date}-${item.dishesId}-${index}`" class="cell-dishes">
              <el-select 
              filterable 
              clearable 
              v-el-select-lazyloading="lazyloading" 
              v-model="item.dishesId"
              @change="selectDishes(row, 'lunches', item.dishesId, index)">
                <el-option 
                v-for="(dishes, dIndex) in dishesSelectList" 
                :key="`lunches-option-${row}-${dishes.dishesId}-${dIndex}`" 
                :value="dishes.dishesId" 
                :label="dishes.dishesName"
                :disabled="row.lunches.map(item => item.dishesId).includes(dishes.dishesId)"></el-option>
              </el-select>
              <i class="el-icon-circle-close" @click="removeFood('lunches', row, index)"></i>
            </div>
            <div class="cell-dishes">
              <el-button plain round class="block" @click="addFood('lunches', row)">添加菜品</el-button>
              <i class="el-icon-circle-close" hidden></i>
            </div>
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
          <div class="cell" v-for="(row, $index) in list" :key="`dinners-${row.date}-${$index}`">
            <div v-for="(item, index) in row.dinners" :key="`horizontal-dinners-${row.date}-${item.dishesId}-${index}`" class="cell-dishes">
              <el-select 
              filterable 
              clearable 
              v-model="item.dishesId"
              @change="selectDishes(row, 'dinners', item.dishesId, index)">
                <el-option 
                v-for="(dishes, dIndex) in dishesSelectList" 
                :key="`dinners-option-${row}-${dishes.dishesId}-${dIndex}`" 
                :value="dishes.dishesId" 
                :label="dishes.dishesName"
                :disabled="row.dinners.map(item => item.dishesId).includes(dishes.dishesId)"></el-option>
              </el-select>
              <i class="el-icon-circle-close" @click="removeFood('dinners', row, index)"></i>
            </div>
            <div class="cell-dishes">
              <el-button plain round class="block" @click="addFood('dinners', row)">添加菜品</el-button>
              <i class="el-icon-circle-close" hidden></i>
            </div>
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
      <el-select v-model="meal" size="small">
        <el-option v-for="meal in meals" :key="meal.val" :value="meal.val" :label="meal.name"></el-option>
      </el-select>
      <div slot="footer" class="operate flex justify-end">
        <div class="btn background-color" @click="addMeal">确定</div>
        <div class="btn default" @click="close">取消</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
    }
  },
  data() {
    return {
      popVisible: false,
      meal: '',
      tableKey: 1
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
      let meal = []
      if (this.list[0].breakfasts) {
        meal = ['breakfasts']
      }

      if (this.list[0].lunches) {
        meal = [...meal, 'lunches']
      }

      if (this.list[0].dinners) {
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
    tableCellClassName({row, column, rowIndex, columnIndex}) {
      if(columnIndex === 3) return 'td-breakfasts'
      return ''
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
    addFood(mealType, row) {
      row[mealType].push({})
    },
    removeFood(mealType, row, index) {
      row[mealType].splice(index, 1)
    },
    selectDishes(row, mealType, dishesId, mealIndex) {
      if (row[mealType].filter(item => item.dishesId === dishesId).length > 1) {
        this.$message({
          message: '请勿重复添加',
          type: 'warning'
        })
        this.$set(row[mealType], mealIndex, {})
        return
      }
      const dishes = this.dishesSelectList.find(item => item.dishesId === dishesId)
      if (dishes) {
        this.$set(row[mealType], mealIndex, dishes)
      }
    }
  }
}
</script>
<style lang="">
  
</style>