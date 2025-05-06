if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "C:/Users/burci/.gradle/caches/8.13/transforms/0b482eed58dfeed681d956b1b2a2abdf/transformed/jetified-fbjni-0.7.0/prefab/modules/fbjni/libs/android.x86/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/burci/.gradle/caches/8.13/transforms/0b482eed58dfeed681d956b1b2a2abdf/transformed/jetified-fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

