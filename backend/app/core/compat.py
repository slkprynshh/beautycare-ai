"""Python 3.9 + Pydantic v2.13 OpenAPI compatibility layer.

Addresses Python 3.9 typing._SpecialForm unpacking behavior when Pydantic's
GenerateJsonSchema introspects CoreSchemaOrFieldType unions.
"""

import typing
import typing_extensions
from typing_extensions import get_origin


def apply_pydantic_openapi_compat():
    try:
        import pydantic.json_schema

        orig_get_literal_values = pydantic.json_schema.get_literal_values

        def safe_get_literal_values(annotation, **kwargs):
            for val in orig_get_literal_values(annotation, **kwargs):
                if get_origin(val) in (typing.Literal, typing_extensions.Literal) or hasattr(val, "__args__"):
                    for sub_val in val.__args__:
                        yield sub_val
                else:
                    yield val

        pydantic.json_schema.get_literal_values = safe_get_literal_values
    except Exception:
        pass


apply_pydantic_openapi_compat()
