from typing import Union

from numpy import inf


def tolist(gen):
    """Convert a generator into a function which returns a list"""

    def patched(*args, **kwargs):
        return list(gen(*args, **kwargs))

    return patched


def int_or_float(value: float) -> Union[int, float]:
    if value in [inf, -inf]:
        return value
    return value if value != int(value) else int(value)
