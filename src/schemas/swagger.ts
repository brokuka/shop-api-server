export const AUTH_SCHEMAS = {
  BaseCredentials: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          user_id: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
          surname: {
            type: 'string',
          },
          middlename: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          group: {
            type: 'string',
          },
          session: {
            type: 'string',
          },
        },
      },
      message: {
        type: 'string',
      },
    },
  },
}

export const PRODUCT_SCHEMAS = {
  Products: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
      },
      message: {
        type: 'string',
        nullable: true,
      },
    },
  },
  Product: {
    type: 'object',
    properties: {
      product_id: {
        type: 'number',
      },
      title: {
        type: 'string',
      },
      price: {
        type: 'number',
      },
      image: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      category: {
        type: 'string',
      },
      slug: {
        type: 'string',
      },
    },
  },
}

export const CART_SCHEMAS = {
  Cart: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          cart_id: {
            type: 'number',
          },
          user_id: {
            type: 'number',
          },
          date: {
            type: 'string',
          },
          total_price: {
            type: 'number',
          },
          total_quantity: {
            type: 'number',
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CartItem',
            },
          },
        },
      },
      message: {
        type: 'string',
        nullable: true,
      },
    },
  },
  CartItem: {
    allOf: [
      {
        $ref: '#/components/schemas/Product',
      },
      {
        type: 'object',
        properties: {
          cart_item_id: {
            type: 'number',
          },
          quantity: {
            type: 'number',
          },
        },
      },
    ],
  },
  CartRequestBody: {
    type: 'object',
    properties: {
      product_id: {
        type: 'number',
      },
      quantity: {
        type: 'number',
      },
    },
  },
  UpdatedCartItem: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          cart_item_id: {
            type: 'number',
          },
          cart_id: {
            type: 'number',
          },
          user_id: {
            type: 'number',
          },
          product_id: {
            type: 'number',
          },
          quantity: {
            type: 'number',
          },
          price: {
            type: 'number',
          },
        },
      },
      message: {
        type: 'string',
        nullable: true,
      },
    },
  },
}

export const ORDER_SCHEMAS = {
  Order: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          order_id: {
            type: 'number',
          },
          user_id: {
            type: 'number',
          },
          total_price: {
            type: 'number',
          },
          total_quantity: {
            type: 'number',
          },
          date: {
            type: 'string',
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem',
            },
          },
        },
      },
      message: {
        type: 'string',
        nullable: true,
      },
    },
  },
  OrderItem: {
    type: 'object',
    properties: {
      order_item_id: {
        type: 'number',
      },
      order_id: {
        type: 'number',
      },
      user_id: {
        type: 'number',
      },
      product: {
        type: 'object',
        $ref: '#/components/schemas/Product',
      },
    },
  },
}

export const USER_SCHEMAS = {
  User: {
    type: 'object',
    properties: {
      user_id: {
        type: 'number',
      },
      name: {
        type: 'string',
      },
      surname: {
        type: 'string',
      },
      middlename: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      group: {
        type: 'string',
      },
    },
  },
  UserRequestBody: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        nullable: true,
      },
      surname: {
        type: 'string',
        nullable: true,
      },
      middlename: {
        type: 'string',
        nullable: true,
      },
    },
  },
}

export const UTIL_SCHEMAS = {
  MessageAndNullData: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        nullable: true,
      },
      message: {
        type: 'string',
      },
    },
  },
}
