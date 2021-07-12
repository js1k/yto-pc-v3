<template>
<div class="priceTable"
     ref="tableDom">
    <el-table :data="tableData"
              v-loading.lock="loading"
              element-loading-background="rgba(255, 255, 255, 0.8)"
              border
              stripe
              size="mini"
              tooltip-effect="dark"
              :show-summary="showSummary"
              :summary-method="getSummaries"
              style="width: 100%"
              @row-dblclick="rowDblclick"
              @cell-click="cellClick"
              :cell-class-name="cellClassName"
              :header-cell-style="{background:'#ebf0f7',color:'#666666'}">
        <!-- 序号 -->
        <el-table-column align="center"
                         label="序号"
                         type="index"
                         :fixed="item.fixed?item.fixed:false"
                         :show-overflow-tooltip="true"
                         label-class-name="tabHeader"
                         width="60"
                         v-if="isSerialNoShow">
        </el-table-column>
        <el-table-column v-for="(item, index) in tableHeader"
                         :key="index"
                         :prop="item.prop"
                         :label="item.label"
                         :fixed="item.fixed?item.fixed:false"
                         :show-overflow-tooltip="true"
                         :min-width="item.minWidth || 150"
                         align="center">
            <!-- 自定义表头 -->
            <template v-slot:header="">
                <slot name="headerSlot"
                      v-bind:header="item">
                    <span class="slot-header">
                        <el-checkbox v-model="allSelected"
                                     @change="doSelectAll(allSelected)"
                                     v-if="item.slotType=='check'"></el-checkbox>
                        <span v-else
                              class="tabHeader">{{item.label}}</span>
                    </span>
                </slot>
            </template>
            <template #default="scope">
                <slot v-if="item.slotType == 'slot'"
                      :data="scope"
                      v-bind="scope"
                      :name="item.prop"></slot>
                <el-checkbox @change="rowSelect(tableData[scope.$index],scope.$index,selectedItems[scope.$index])"
                             v-else-if="item.slotType=='check'"
                             :disabled="item.checkout?item.checkout(scope):false"
                             v-model="selectedItems[scope.$index]"></el-checkbox>
                <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
        </el-table-column>
        <el-table-column v-if="tableOption && tableOption.length > 0"
                         fixed="left"
                         label="操作"
                         label-class-name="tabHeader"
                         :show-overflow-tooltip="true"
                         align="center"
                         :width="optionWidth">
            <template #default="scope">
                <el-button v-for="(item,index) in tableOption"
                           :key="index"
                           :type="item.type"
                           :size="item.size || 'mini'"
                           @click="handleClick(item.value, scope.row)">{{ item.label }}</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div style="margin: 20px 0 30px;"
         v-show="showPagination">
        <el-pagination layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10, 50, 100, 200]"
                       :page-count="6"
                       :total="total"
                       :small="true"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNum"
                       :page-size="pageSize">
        </el-pagination>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
export default defineComponent({
    name: 'yto-table',
    props: {
        tableHeader: Array,
        tableData: Array,
        tableOption: Array,
        total: Number || String,
        showSummary: {
            type: Boolean,
            default: false
        },
        pageNum: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        loading: {
            type: Boolean,
            default: false
        },
        optionWidth: {
            type: Number,
            default: 80
        },
        showPagination: {
            type: Boolean,
            default: true
        },
        // 是否展示表格序号
        isSerialNoShow: {
            type: Boolean,
            default: () => false
        },
        checkDisabled: {
            type: Boolean || Function,
            default: () => false
        },
        cellClassName: {
            type: Function,
            default: () => {
                return '';
            }
        },
        summarise: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    setup(props, { emit }) {
        // 多选相关
        const selectedItems = ref<Record<string, boolean>>({});
        const allSelected = computed({
            get() {
                const values = Object.values(selectedItems.value);
                const array = props.tableData.filter((item: any) => {
                    if (item.handInStatus && item.handInStatus == '已收款') return; return item;
                });
                return array.length === values.length && values.every(Boolean) && values.length != 0;
            },
            set(val: boolean) {
                selectedItems.value = {};
                const obj = {};
                props.tableData.forEach((item: any, indexs: number) => {
                    if (item.handInStatus && item.handInStatus == '已收款') return;
                    obj[indexs] = item;
                });
                for (const key in obj) {
                    selectedItems.value[key] = val;
                }
            }
        });
        const resetSelectedState = () => {
            props.tableData.forEach((_, index) => {
                selectedItems.value[index] = false;
            });
        };
        const doSelectAll = (state: boolean) => {
            emit('doSelectAll', state);
        };
        const rowSelect = (row: Record<string, any>, index: number, state: boolean) => {
            emit('rowSelect', row, index, state);
        };
        const currentSize = ref(30);
        const tableDom = ref(null);
        /* ------methods------ */
        const handleClick = (value: string, row: Record<string, any>) => {
            emit('handle-click', value, row);
        };
        const handleSizeChange = (val: number) => {
            resetSelectedState();
            emit('getPageSize', val);
        };
        const handleCurrentChange = (val: number) => {
            resetSelectedState();
            emit('getPageNum', val);
        };
        const rowDblclick = (row: any, column: any, event: any) => {
            emit('row-dblclick', row, column, event);
        };
        const cellClick = (row: any, column: any, cell: any, event: any) => {
            emit('cellClick', row, column, cell, event);
        };
        const getSummaries = ({ columns }) => {
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if (Object.keys(props.summarise).indexOf(column.property) > -1) {
                    sums[index] = props.summarise[column.property];
                }
            });
            return sums;
        };
        return {
            currentSize,
            tableDom,
            handleClick,
            handleSizeChange,
            handleCurrentChange,
            rowDblclick,
            allSelected,
            resetSelectedState,
            doSelectAll,
            rowSelect,
            selectedItems,
            cellClick,
            getSummaries
        };
    }
});
</script>

<style lang="scss">
.priceTable {
    width: 100%;
    padding-top: 10px;
    height: 100%;

    .el-table__body-wrapper {
        z-index: 2
    }

    .tabHeader {
        color: #333 !important;
        font-weight: bold;
    }

    .slot-header {
        color: #333 !important;
        font-weight: bold;
    }

    .table-btns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 3px;

        .el-button {
            margin: 0 2px;
            padding: 4px 10px;
        }
    }
}
</style>
